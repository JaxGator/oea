import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { MemberList } from "@/components/members/MemberList";
import { MemberTable } from "@/components/members/MemberTable";
import { useAuthState } from "@/hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

const ErrorFallback = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    toast({
      title: "Error",
      description: "There was a problem loading the members. Please try again.",
      variant: "destructive",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-[#222222] flex items-center justify-center">
      <div className="text-white">Error loading members. Please try refreshing the page.</div>
    </div>
  );
};

export default function Members() {
  const { user } = useAuthState();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Add error logging
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Caught error:', {
        error: event.error,
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: new Date().toISOString()
      });
      toast({
        title: "Error",
        description: "An error occurred. Please try refreshing the page.",
        variant: "destructive",
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [toast]);

  const { data: currentUserProfile, isLoading: isLoadingProfile, error: profileError } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching profile:', {
            error,
            userId: user.id,
            timestamp: new Date().toISOString()
          });
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error('Query error:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000)
  });

  const { data: members = [], isLoading: isLoadingMembers, error } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('username');
        
        if (error) {
          console.error('Error fetching members:', {
            error,
            timestamp: new Date().toISOString()
          });
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Query error:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        async (payload) => {
          try {
            const { data: senderProfile } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', payload.new.sender_id)
              .maybeSingle();

            toast({
              title: "New Message",
              description: `${senderProfile?.username || 'Someone'} sent you a message`,
              action: (
                <button
                  onClick={() => navigate('/messages')}
                  className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium"
                >
                  View
                </button>
              ),
            });
          } catch (error) {
            console.error('Error handling message notification:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, toast, navigate]);

  if (error || profileError) {
    console.error('Render error:', error || profileError);
    toast({
      title: "Error",
      description: "Failed to load members. Please try again.",
      variant: "destructive",
    });
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Error loading members. Please try again.</div>
      </div>
    );
  }

  const isLoading = isLoadingMembers || isLoadingProfile;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Loading members...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div className="min-h-screen bg-[#222222] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-6 w-6" aria-hidden="true" />
              <h1 className="text-2xl font-bold" id="members-heading">Member Directory</h1>
            </div>
            
            {members.length === 0 ? (
              <div className="text-center py-8 text-gray-500" role="status">
                No members found.
              </div>
            ) : (
              <div role="region" aria-labelledby="members-heading">
                {isMobile ? (
                  <MemberList 
                    members={members}
                    currentUserIsAdmin={currentUserProfile?.is_admin || false}
                    isMobile={isMobile}
                  />
                ) : (
                  <ScrollArea className="rounded-md border">
                    <MemberTable 
                      members={members}
                      currentUserIsAdmin={currentUserProfile?.is_admin || false}
                    />
                  </ScrollArea>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
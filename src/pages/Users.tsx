import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthState } from "@/hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { useMemberQueries } from "@/hooks/members/useMemberQueries";
import { MemberPageContent } from "@/components/members/MemberPageContent";

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
  const { profileQuery, membersQuery } = useMemberQueries(user?.id);

  console.log('Members Page - Initial render:', {
    hasUser: !!user,
    userId: user?.id,
    profileQueryData: profileQuery.data,
    membersQueryData: membersQuery.data,
    isProfileLoading: profileQuery.isLoading,
    isMembersLoading: membersQuery.isLoading
  });

  // Global error handler
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

  // Real-time message notifications
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

  if (membersQuery.error || profileQuery.error) {
    console.error('Query error:', {
      membersError: membersQuery.error,
      profileError: profileQuery.error
    });
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Error loading members. Please try again.</div>
      </div>
    );
  }

  const isLoading = membersQuery.isLoading || profileQuery.isLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Loading members...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <MemberPageContent
        members={membersQuery.data || []}
        currentUserIsAdmin={profileQuery.data?.is_admin || false}
        isMobile={isMobile}
      />
    </ErrorBoundary>
  );
}
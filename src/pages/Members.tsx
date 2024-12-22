import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { MemberList } from "@/components/members/MemberList";
import { MemberTable } from "@/components/members/MemberTable";
import { useAuthState } from "@/hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import { GroupChat } from "@/components/chat/GroupChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Members() {
  const { user } = useAuthState();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { data: currentUserProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000)
  });

  const { data: members = [], isLoading: isLoadingMembers, error } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('username');
      
      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }

      return data || [];
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, toast, navigate]);

  if (error) {
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
    <div className="min-h-screen bg-[#222222] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Event Discussion
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-0">
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
          </TabsContent>

          <TabsContent value="chat" className="mt-0">
            <div className="bg-white rounded-lg shadow-lg">
              <GroupChat />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
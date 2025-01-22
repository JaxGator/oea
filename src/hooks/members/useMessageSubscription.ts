import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

export function useMessageSubscription(initialMembers: Profile[]) {
  const [members, setMembers] = useState<Profile[]>(initialMembers);
  const { toast } = useToast();

  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  useEffect(() => {
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload: any) => {
          // Update unread status for the receiver
          setMembers(prevMembers => 
            prevMembers.map(member => {
              if (member.id === payload.new.receiver_id) {
                return { ...member, has_unread_messages: true };
              }
              return member;
            })
          );

          // Show toast notification for new messages
          if (payload.new.receiver_id === supabase.auth.getUser()?.data?.user?.id) {
            toast({
              title: "New Message",
              description: "You have received a new message",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return members;
}
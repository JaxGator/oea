
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";
import { Member } from "@/components/members/types";
import { useToast } from "@/hooks/use-toast";

const transformToMember = (profile: Profile): Member => ({
  id: profile.id,
  username: profile.username,
  full_name: profile.full_name,
  avatar_url: profile.avatar_url,
  is_admin: profile.is_admin,
  is_approved: profile.is_approved,
  is_member: profile.is_member,
  created_at: profile.created_at,
  event_reminders_enabled: profile.event_reminders_enabled,
  email: profile.email,
  email_notifications: profile.email_notifications,
  in_app_notifications: profile.in_app_notifications,
  interests: profile.interests,
  updated_at: profile.updated_at,
  leaderboard_opt_out: profile.leaderboard_opt_out
});

export function useMessageSubscription(initialMembers: Member[]) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
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
        async (payload: any) => {
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
          const { data: { session } } = await supabase.auth.getSession();
          const currentUserId = session?.user?.id;
          
          if (payload.new.receiver_id === currentUserId) {
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

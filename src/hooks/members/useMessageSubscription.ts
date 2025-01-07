import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";

export function useMessageSubscription(initialMembers: Profile[]) {
  const [members, setMembers] = useState<Profile[]>(initialMembers);

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
          setMembers(prevMembers => 
            prevMembers.map(member => {
              if (member.id === payload.new.receiver_id) {
                return { ...member, has_unread_messages: true };
              }
              return member;
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return members;
}
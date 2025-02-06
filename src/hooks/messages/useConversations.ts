
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Message, GroupMessage } from "@/components/messages/types";
import { Profile } from "@/types/auth";

interface GroupMessageResponse {
  id: string;
  content: string;
  created_at: string;
  sender: Profile;
  group_chat: {
    id: string;
    name: string;
    description: string;
  };
}

export function useConversations(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', userId],
    queryFn: async () => {
      if (!userId) return null;

      // Fetch direct messages where user is either sender or receiver
      const { data: directMessages, error: directError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id(*),
          receiver:profiles!receiver_id(*)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (directError) {
        console.error('Error fetching direct messages:', directError);
        throw directError;
      }

      // Fetch group messages for groups the user is part of
      const { data: groupMessages, error: groupError } = await supabase
        .from('group_chats')
        .select(`
          id,
          name,
          description,
          messages:group_chat_messages(
            id,
            content,
            created_at,
            sender:profiles!inner(*)
          ),
          participants:group_chat_participants(
            user:profiles(*)
          )
        `)
        .eq('group_chat_participants.user_id', userId);

      if (groupError) {
        console.error('Error fetching group messages:', groupError);
        throw groupError;
      }

      return {
        directMessages: directMessages as Message[],
        groupMessages: groupMessages || []
      };
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) return;

    // Listen for message changes (both sent and received)
    const messageChannel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${userId},receiver_id.eq.${userId})`,
        },
        () => {
          console.log('Message change detected, invalidating query');
          queryClient.invalidateQueries({ queryKey: ['messages', userId] });
        }
      )
      .subscribe();

    // Listen for group message changes
    const groupChannel = supabase
      .channel('group-messages-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_chat_messages',
        },
        () => {
          console.log('Group message change detected, invalidating query');
          queryClient.invalidateQueries({ queryKey: ['messages', userId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(groupChannel);
    };
  }, [userId, queryClient]);

  return { messages, isLoading };
}

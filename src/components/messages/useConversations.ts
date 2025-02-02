import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Message } from "./types";
import { Profile } from "@/types/auth";

interface GroupChatMessage {
  id: string;
  content: string;
  created_at: string;
  sender: Profile;
  group_chat: {
    id: string;
    name: string;
    description: string | null;
  };
}

export function useConversations(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', userId],
    queryFn: async () => {
      // Fetch direct messages
      const { data: directMessages, error: directError } = await supabase
        .from('messages')
        .select('*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (directError) throw directError;

      // Fetch group messages for groups the user is part of
      const { data: groupMessages, error: groupError } = await supabase
        .from('group_chat_messages')
        .select(`
          id,
          content,
          created_at,
          sender:profiles!sender_id(*),
          group_chat:group_chats(
            id,
            name,
            description
          )
        `)
        .eq('group_chat.group_chat_participants.user_id', userId)
        .order('created_at', { ascending: false });

      if (groupError) throw groupError;

      return {
        directMessages: directMessages as Message[],
        groupMessages: groupMessages as GroupChatMessage[]
      };
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) return;

    // Listen for direct message changes
    const directChannel = supabase
      .channel('direct-messages-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', userId] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', userId] });
        }
      )
      .subscribe();

    // Listen for group message changes
    const groupChannel = supabase
      .channel('group-messages-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_chat_messages',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', userId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(directChannel);
      supabase.removeChannel(groupChannel);
    };
  }, [userId, queryClient]);

  return { messages, isLoading };
}
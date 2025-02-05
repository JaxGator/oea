
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Message, GroupMessage } from "./types";
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
    participants: Profile[];
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

      if (groupError) throw groupError;

      // Transform group messages to match the expected type
      const transformedGroupMessages = (groupMessages || []).map(chat => ({
        id: chat.id,
        isGroup: true,
        groupInfo: {
          id: chat.id,
          name: chat.name,
          description: chat.description,
          participants: chat.participants.map((p: any) => p.user)
        },
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          group_chat_id: chat.id
        })),
        lastMessage: chat.messages[0] || null
      }));

      return {
        directMessages: directMessages as Message[],
        groupMessages: transformedGroupMessages
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

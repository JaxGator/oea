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
    description: string | null;
  };
}

export function useConversations(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', userId],
    queryFn: async () => {
      console.log('Fetching messages for user:', userId);

      // Fetch direct messages
      const { data: directMessages, error: directError } = await supabase
        .from('messages')
        .select('*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (directError) throw directError;
      console.log('Direct messages response:', directMessages);

      // Fetch group messages for groups the user is part of
      const { data: groupMessages, error: groupError } = await supabase
        .from('group_chat_messages')
        .select(`
          id,
          content,
          created_at,
          sender:profiles!sender_id(*),
          group_chat:group_chats!inner(
            id,
            name,
            description,
            participants:group_chat_participants!inner(user_id)
          )
        `)
        .eq('group_chat.participants.user_id', userId)
        .order('created_at', { ascending: false });

      if (groupError) {
        console.error('Group messages error:', groupError);
        throw groupError;
      }
      console.log('Group messages response:', groupMessages);

      // Transform group messages to match the expected type
      const transformedGroupMessages = (groupMessages || []).map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        created_at: msg.created_at,
        sender: msg.sender as Profile,
        group_chat: {
          id: msg.group_chat.id,
          name: msg.group_chat.name,
          description: msg.group_chat.description
        }
      })) as GroupMessage[];

      console.log('Transformed group messages:', transformedGroupMessages);

      const finalMessages = {
        directMessages: directMessages as Message[],
        groupMessages: transformedGroupMessages
      };

      console.log('Final messages object:', finalMessages);
      return finalMessages;
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
        (payload) => {
          console.log('New direct message received:', payload);
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
        (payload) => {
          console.log('Direct message updated:', payload);
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
        (payload) => {
          console.log('New group message received:', payload);
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
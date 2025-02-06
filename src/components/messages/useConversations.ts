
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Message, GroupMessage, Profile } from "./types";

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
      // Fetch direct messages
      const { data: directMessages, error: directError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id(id, username, full_name, avatar_url, created_at, is_admin, is_approved, is_member, email_notifications, in_app_notifications, event_reminders_enabled),
          receiver:profiles!receiver_id(id, username, full_name, avatar_url, created_at, is_admin, is_approved, is_member, email_notifications, in_app_notifications, event_reminders_enabled)
        `)
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
          sender:profiles!inner(
            id, username, full_name, avatar_url, created_at, is_admin, 
            is_approved, is_member, email_notifications, in_app_notifications, 
            event_reminders_enabled
          ),
          group_chat:group_chats!inner(
            id,
            name,
            description
          )
        `)
        .eq('group_chat.group_chat_participants.user_id', userId)
        .order('created_at', { ascending: false });

      if (groupError) throw groupError;

      // Transform group messages to match the expected type
      const transformedGroupMessages = (groupMessages as unknown as GroupMessageResponse[])?.map(msg => ({
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

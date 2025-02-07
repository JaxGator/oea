
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Message, GroupChatRaw } from "@/components/messages/types";
import { Profile } from "@/types/auth";

export function useConversations(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', userId],
    queryFn: async ({ signal }) => {
      if (!userId) return null;

      console.log('Fetching messages for user:', userId);

      try {
        // Fetch direct messages
        const { data: directMessages, error: directError } = await supabase
          .from('messages')
          .select(`
            *,
            sender:profiles!messages_sender_id_fkey(
              id, username, full_name, avatar_url, created_at, is_admin, 
              is_approved, is_member, email_notifications, in_app_notifications, 
              event_reminders_enabled
            ),
            receiver:profiles!messages_receiver_id_fkey(
              id, username, full_name, avatar_url, created_at, is_admin, 
              is_approved, is_member, email_notifications, in_app_notifications, 
              event_reminders_enabled
            )
          `)
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .order('created_at', { ascending: false });

        if (directError) {
          console.error('Error fetching direct messages:', directError);
          throw directError;
        }

        console.log('Direct messages fetched:', directMessages?.length);

        // Fetch group messages
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
              sender:profiles!group_chat_messages_sender_id_fkey(
                id, username, full_name, avatar_url, created_at, is_admin, 
                is_approved, is_member, email_notifications, in_app_notifications, 
                event_reminders_enabled
              )
            ),
            participants:group_chat_participants(
              user:profiles(
                id, username, full_name, avatar_url, created_at, is_admin, 
                is_approved, is_member, email_notifications, in_app_notifications, 
                event_reminders_enabled
              )
            )
          `)
          .eq('group_chat_participants.user_id', userId);

        if (groupError) {
          console.error('Error fetching group messages:', groupError);
          throw groupError;
        }

        console.log('Group messages fetched:', groupMessages?.length);

        // Transform group messages to match the expected GroupChatRaw type
        const transformedGroupChats = (groupMessages || []).map(chat => ({
          id: chat.id,
          name: chat.name,
          description: chat.description,
          messages: chat.messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            created_at: msg.created_at,
            sender: Array.isArray(msg.sender) ? msg.sender[0] : msg.sender as Profile,
            group_chat_id: chat.id
          })),
          participants: chat.participants.map(p => ({
            user: Array.isArray(p.user) ? p.user[0] : p.user as Profile
          }))
        })) as GroupChatRaw[];

        return {
          directMessages: (directMessages || []) as Message[],
          groupMessages: transformedGroupChats
        };
      } catch (error) {
        console.error('Error in useConversations:', error);
        throw error;
      }
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) return;

    // Subscribe to messages changes
    const messageChannel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${userId},receiver_id.eq.${userId})`,
        },
        (payload) => {
          console.log('Message change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['messages', userId] });
        }
      )
      .subscribe();

    // Subscribe to group messages
    const groupChannel = supabase
      .channel('group-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_chat_messages',
        },
        (payload) => {
          console.log('Group message change detected:', payload);
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


import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Message, GroupChatRaw, Profile } from "@/components/messages/types";

export function useConversations(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', userId],
    queryFn: async () => {
      if (!userId) return null;

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

      if (directError) {
        console.error('Error fetching direct messages:', directError);
        throw directError;
      }

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
            sender:profiles!inner(
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

      // Transform the group messages data to match our types
      const transformedGroupMessages = (groupMessages || []).map((chat): GroupChatRaw => ({
        id: chat.id,
        name: chat.name,
        description: chat.description,
        messages: chat.messages.map(msg => ({
          id: msg.id,
          content: msg.content,
          created_at: msg.created_at,
          sender: msg.sender as Profile,
          group_chat_id: chat.id
        })),
        participants: chat.participants.map(participant => ({
          user: participant.user as Profile
        }))
      }));

      return {
        directMessages: (directMessages || []) as Message[],
        groupMessages: transformedGroupMessages
      };
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) return;

    // Listen for message changes
    const messageChannel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
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

import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseGroupChatRealtimeProps {
  chatId: string;
  onParticipantAdded?: (payload: any) => void;
  onParticipantRemoved?: (payload: any) => void;
  onMessageReceived?: (payload: any) => void;
}

export function useGroupChatRealtime({
  chatId,
  onParticipantAdded,
  onParticipantRemoved,
  onMessageReceived,
}: UseGroupChatRealtimeProps) {
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to participant changes
    const participantsChannel = supabase
      .channel(`group_chat_${chatId}_participants`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_chat_participants',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          onParticipantAdded?.(payload);
          toast({
            title: "New Participant",
            description: "A new participant has joined the chat",
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'group_chat_participants',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          onParticipantRemoved?.(payload);
          toast({
            title: "Participant Left",
            description: "A participant has left the chat",
          });
        }
      )
      .subscribe();

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel(`group_chat_${chatId}_messages`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_chat_messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          onMessageReceived?.(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(participantsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [chatId, onParticipantAdded, onParticipantRemoved, onMessageReceived, toast]);
}
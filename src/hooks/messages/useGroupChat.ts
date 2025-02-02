import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface GroupMessage {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  group_chat_id: string;
  sender: {
    username: string;
    avatar_url: string;
  };
}

export function useGroupChat(groupId: string) {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['group-messages', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_chat_messages')
        .select('*, sender:profiles!sender_id(*)')
        .eq('group_chat_id', groupId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as GroupMessage[];
    },
    enabled: !!groupId,
  });

  useEffect(() => {
    if (!groupId) return;

    const channel = supabase
      .channel('group-chat-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_chat_messages',
          filter: `group_chat_id=eq.${groupId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['group-messages', groupId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId, queryClient]);

  return { messages, isLoading };
}
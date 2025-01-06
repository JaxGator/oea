import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/integrations/supabase/types/messages";
import { useAuthState } from "@/hooks/useAuthState";

export function useMessages(selectedUserId: string | null) {
  const { user } = useAuthState();

  return useQuery<Message[]>({
    queryKey: ['messages', selectedUserId],
    queryFn: async () => {
      if (!selectedUserId || !user) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${selectedUserId},receiver_id.eq.${selectedUserId}`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
      
      return data as Message[];
    },
    enabled: !!selectedUserId && !!user,
    retry: 3,
    retryDelay: 1000
  });
}
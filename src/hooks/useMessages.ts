import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/integrations/supabase/types";

export function useMessages(selectedUserId: string | null) {
  return useQuery({
    queryKey: ['messages', selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${selectedUserId},receiver_id.eq.${selectedUserId}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!selectedUserId
  });
}
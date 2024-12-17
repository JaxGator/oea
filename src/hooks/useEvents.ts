import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";

export const useEvents = (selectedDate?: Date) => {
  return useQuery({
    queryKey: ['events', selectedDate?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select(`
          *,
          event_rsvps (
            id,
            response,
            user_id,
            profiles (
              full_name,
              username
            )
          )
        `)
        .order('date');

      if (selectedDate) {
        query = query.eq('date', selectedDate.toISOString().split('T')[0]);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
      
      return data as Event[];
    },
  });
};
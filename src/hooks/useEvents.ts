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
          created_by:profiles!events_created_by_fkey(username),
          rsvps:event_rsvps(*)
        `)
        .order('date');

      if (selectedDate) {
        query = query.eq('date', selectedDate.toISOString().split('T')[0]);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Event[];
    },
  });
};
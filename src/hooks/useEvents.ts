import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleQueryResult } from '@/utils/supabase-helpers';
import type { Event } from '@/types/event';

export function useEvents(selectedDate?: Date) {
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

      const result = await query;
      return handleQueryResult(result) as Event[];
    }
  });
}
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleQueryResult } from '@/utils/supabase-helpers';
import { transformEventData } from './events/useEventTransform';
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
            event_id,
            user_id,
            response,
            created_at,
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
      const data = await handleQueryResult(result);
      return transformEventData(Array.isArray(data) ? data : [data]);
    }
  });
}
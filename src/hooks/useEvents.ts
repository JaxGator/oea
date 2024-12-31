import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleQueryResult } from '@/utils/supabase-helpers';
import { transformEventData } from './events/useEventTransform';
import type { Event } from '@/types/event';

export function useEvents(selectedDate?: Date) {
  return useQuery({
    queryKey: ['events', selectedDate?.toISOString()],
    queryFn: async () => {
      try {
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
      } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
    },
    gcTime: 5 * 60 * 1000, // Data garbage collection after 5 minutes
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
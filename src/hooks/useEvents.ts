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
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache persists for 30 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent refetch on component mount
  });
}
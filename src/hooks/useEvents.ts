import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleQueryResult } from '@/utils/supabase-helpers';
import { transformEventData } from './events/useEventTransform';
import type { Event } from '@/types/event';
import type { EventFilters } from '@/types/filters';

export function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: ['events', filters],
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

      if (filters?.date) {
        query = query.eq('date', filters.date.toISOString().split('T')[0]);
      }

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters?.maxGuests) {
        query = query.gte('max_guests', filters.maxGuests);
      }

      if (filters?.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      const result = await query;
      const data = await handleQueryResult(result);
      return transformEventData(Array.isArray(data) ? data : [data]);
    }
  });
}
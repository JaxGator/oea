import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleQueryResult } from '@/utils/supabase-helpers';
import { transformEventData } from './events/useEventTransform';
import type { Event } from '@/types/event';
import { toast } from 'sonner';

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

        // Only filter by date if a date is selected
        if (selectedDate) {
          const dateStr = selectedDate.toISOString().split('T')[0];
          query = query.eq('date', dateStr);
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching events:', error);
          toast.error('Failed to load events. Please try again.');
          throw error;
        }

        if (!data) {
          console.log('No events found');
          return [];
        }

        console.log('Fetched events:', data);
        return transformEventData(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events. Please try again.');
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
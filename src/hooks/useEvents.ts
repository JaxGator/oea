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
        console.log('Fetching events...', {
          date: selectedDate,
          origin: window.location.origin
        });

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session error while fetching events:', sessionError);
          throw new Error('Authentication error');
        }

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
        
        if (result.error) {
          console.error('Error in events query:', {
            error: result.error,
            status: result.status,
            statusText: result.statusText
          });
          throw result.error;
        }

        console.log('Events fetched successfully:', {
          count: result.data?.length,
          status: result.status
        });

        const data = await handleQueryResult(result);
        return transformEventData(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error('Error fetching events:', {
          error,
          timestamp: new Date().toISOString(),
          origin: window.location.origin
        });
        toast.error('Failed to load events. Please try again.');
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    meta: {
      errorMessage: 'Failed to load events'
    }
  });
}
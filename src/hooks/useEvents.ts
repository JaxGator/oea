
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from './useAuthState';
import { useQueryClient } from '@tanstack/react-query';
import type { Event, EventsPage } from '@/types/database';
import { startOfDay } from 'date-fns';

export function useEvents(selectedDate?: Date) {
  const { profile, isAuthenticated } = useAuthState();
  const isApproved = profile?.is_approved;
  const today = startOfDay(new Date()).toISOString().split('T')[0];

  console.log('Fetching events with today:', today);

  return useInfiniteQuery<EventsPage>({
    queryKey: ['events', selectedDate?.toISOString(), isAuthenticated, isApproved],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      try {
        let query = supabase
          .from('events')
          .select(`
            *,
            event_rsvps (
              id,
              user_id,
              response,
              status,
              created_at,
              profiles:profiles!event_rsvps_user_id_fkey (
                full_name,
                username
              ),
              event_guests (
                id,
                first_name
              )
            )
          `)
          .gte('date', today) // Changed to include today's events
          .order('date', { ascending: true })
          .order('time', { ascending: true });

        if (!isAuthenticated) {
          query = query.eq('is_published', true);
        } else if (!isApproved) {
          query = query.eq('is_published', true);
        }

        if (selectedDate) {
          const dateStr = selectedDate.toISOString().split('T')[0];
          query = query.gte('date', dateStr);
        }

        // Add a case statement to sort today's events first
        query = query.order(
          `CASE WHEN date = '${today}' THEN 0 ELSE 1 END`,
          { ascending: true }
        );

        console.log('SQL Query:', query.toSQL());

        const { data: events, error, count } = await query;

        if (error) {
          console.error('Events query error:', error);
          throw error;
        }

        console.log('Fetched events:', events);

        return {
          data: events as Event[],
          count: count || 0,
          nextPage: null
        };
      } catch (error) {
        console.error('Error in useEvents:', error);
        toast.error('Failed to load events. Please try again.');
        throw error;
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5,
  });
}

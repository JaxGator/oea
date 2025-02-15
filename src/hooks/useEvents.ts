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
          .gte('date', today) // Include today's events
          .order('date', { ascending: true }); // First order by date

        if (!isAuthenticated) {
          query = query.eq('is_published', true);
        } else if (!isApproved) {
          query = query.eq('is_published', true);
        }

        if (selectedDate) {
          const dateStr = selectedDate.toISOString().split('T')[0];
          query = query.gte('date', dateStr);
        }

        const { data: events, error, count } = await query;

        if (error) {
          console.error('Events query error:', error);
          throw error;
        }

        // Sort events with today's events first in memory
        const sortedEvents = (events as Event[]).sort((a, b) => {
          if (a.date === today && b.date !== today) return -1;
          if (b.date === today && a.date !== today) return 1;
          // If both events are on the same day, sort by time
          if (a.date === b.date) {
            return a.time.localeCompare(b.time);
          }
          // Otherwise maintain date order
          return a.date.localeCompare(b.date);
        });

        console.log('Fetched events:', sortedEvents);

        return {
          data: sortedEvents,
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

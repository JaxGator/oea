
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from './useAuthState';
import { useQueryClient } from '@tanstack/react-query';
import type { Event, EventsPage } from '@/types/database';
import { startOfDay } from 'date-fns';

export function useEvents(selectedDate?: Date, eventId?: string) {
  const { profile, isAuthenticated } = useAuthState();
  const isApproved = profile?.is_approved;

  console.log('Fetching events with params:', { selectedDate, eventId });

  return useInfiniteQuery<EventsPage>({
    queryKey: ['events', selectedDate?.toISOString(), isAuthenticated, isApproved, eventId],
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
          `);

        // If we have a specific event ID, fetch just that event
        if (eventId) {
          query = query.eq('id', eventId);
        } else {
          // Filter by published status for non-admin users
          if (!isAuthenticated) {
            query = query.eq('is_published', true);
          } else if (!isApproved) {
            query = query.eq('is_published', true);
          }

          // Apply date filter if selected
          if (selectedDate) {
            const dateStr = selectedDate.toISOString().split('T')[0];
            query = query.gte('date', dateStr);
          }
        }

        const { data: events, error } = await query;

        if (error) {
          console.error('Events query error:', error);
          throw error;
        }

        // Sort events with today's events first in memory
        const sortedEvents = (events as Event[])?.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }) || [];

        console.log('Fetched events:', sortedEvents);

        return {
          data: sortedEvents,
          count: sortedEvents.length,
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


import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Event } from '@/types/event';
import { toast } from 'sonner';
import { useAuthState } from './useAuthState';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { type Database } from '@/types/database.types';

type EventResponseRow = Database['public']['Tables']['events']['Row'] & {
  event_rsvps?: Array<{
    id: string;
    user_id: string;
    response: string;
    status: string;
    created_at: string;
    profiles?: {
      full_name: string | null;
      username: string;
    };
    event_guests?: Array<{
      id: string;
      first_name: string | null;
    }>;
  }>;
};

interface EventsPage {
  events: Event[];
  totalCount: number;
  nextPage: number | null;
}

type EventsResponse = {
  pages: EventsPage[];
  pageParams: number[];
}

export function useEvents(selectedDate?: Date) {
  const { profile, isAuthenticated } = useAuthState();
  const isApproved = profile?.is_approved;
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        () => {
          console.log('Event change detected, invalidating query cache');
          queryClient.invalidateQueries({ queryKey: ['events'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useInfiniteQuery<EventsPage, Error>({
    queryKey: ['events', selectedDate?.toISOString(), isAuthenticated, isApproved],
    queryFn: async () => {
      try {
        console.log('Fetching events with auth state:', {
          isAuthenticated,
          isApproved,
          userId: profile?.id,
          selectedDate: selectedDate?.toISOString()
        });

        let query = supabase
          .from('events')
          .select(`
            *,
            event_rsvps!event_rsvps_event_id_fkey (
              id,
              user_id,
              response,
              status,
              created_at,
              profiles!event_rsvps_user_id_fkey (
                full_name,
                username
              ),
              event_guests (
                id,
                first_name
              )
            )
          `)
          .order('is_featured', { ascending: false })
          .order('date', { ascending: true });

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
          console.error('Events query error:', {
            error,
            context: {
              isAuthenticated,
              isApproved,
              userId: profile?.id,
              selectedDate: selectedDate?.toISOString()
            }
          });
          
          if (error.code === '401') {
            toast.error('Session expired. Please sign in again.');
          } else if (error.code === '403') {
            toast.error('You do not have permission to view these events.');
          } else {
            toast.error('Failed to load events. Please try again.');
          }
          
          throw error;
        }

        if (!events) {
          console.log('No events found');
          return { 
            events: [], 
            totalCount: 0,
            nextPage: null 
          };
        }

        const transformedEvents = (events as EventResponseRow[]).map(event => ({
          ...event,
          rsvps: event.event_rsvps || [],
          attendees: event.event_rsvps?.filter(rsvp => 
            rsvp.response === 'attending' && 
            rsvp.status === 'confirmed'
          ) || [],
          guests: event.event_rsvps?.flatMap(rsvp => 
            rsvp.event_guests || []
          ) || []
        }));

        console.log('Successfully fetched events:', {
          count: transformedEvents.length,
          firstEvent: transformedEvents[0],
          dates: transformedEvents.map(e => e.date)
        });

        return { 
          events: transformedEvents,
          totalCount: count || 0,
          nextPage: null
        };
      } catch (error) {
        console.error('Error in useEvents:', error);
        toast.error('Failed to load events. Please try again.');
        throw error;
      }
    },
    initialPageParam: 0,
    getNextPageParam: () => null,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { transformEventData } from './events/useEventTransform';
import type { Event } from '@/types/event';
import { toast } from 'sonner';
import { useAuthState } from './useAuthState';

const EVENTS_PER_PAGE = 9;

export function useEvents(selectedDate?: Date, page: number = 1) {
  const { profile, isAuthenticated } = useAuthState();
  const isApproved = profile?.is_approved;

  return useQuery({
    queryKey: ['events', selectedDate?.toISOString(), isAuthenticated, isApproved, page],
    queryFn: async () => {
      try {
        console.log('Fetching events with auth state:', {
          isAuthenticated,
          isApproved,
          userId: profile?.id,
          selectedDate: selectedDate?.toISOString(),
          page
        });

        // Calculate the range for pagination
        const from = (page - 1) * EVENTS_PER_PAGE;
        const to = from + EVENTS_PER_PAGE - 1;

        // Comprehensive query that includes all related data
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
              profiles (
                full_name,
                username
              ),
              event_guests (
                id,
                first_name
              )
            )
          `)
          .range(from, to);

        // For public access, only show published events
        if (!isAuthenticated) {
          query = query
            .eq('is_published', true)
            .order('date');
        } else if (isAuthenticated && isApproved) {
          // If user is authenticated and approved, show all events
          query = query.order('date');
        } else {
          // For authenticated but not approved users, show only published events
          query = query
            .eq('is_published', true)
            .order('date');
        }

        // Only filter by date if a date is selected
        if (selectedDate) {
          const dateStr = selectedDate.toISOString().split('T')[0];
          query = query.gte('date', dateStr);
        }

        const { data: events, error, count } = await query;
        
        if (error) {
          console.error('Error fetching events:', {
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
          return { events: [], totalCount: 0 };
        }

        // Transform and organize the data
        const transformedEvents = events.map(event => ({
          ...event,
          rsvps: event.event_rsvps || [],
          attendees: event.event_rsvps?.filter(rsvp => 
            rsvp.response === 'attending' && rsvp.status === 'confirmed'
          ) || [],
          guests: event.event_rsvps?.flatMap(rsvp => 
            rsvp.event_guests || []
          ) || []
        }));

        console.log('Successfully fetched events:', {
          count: transformedEvents.length,
          firstEvent: transformedEvents[0]
        });

        return { 
          events: transformedEvents,
          totalCount: count || 0
        };
      } catch (error) {
        console.error('Error in useEvents:', error);
        toast.error('Failed to load events. Please try again.');
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}
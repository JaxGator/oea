import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { transformEventData } from './events/useEventTransform';
import type { Event } from '@/types/event';
import { toast } from 'sonner';
import { useAuthState } from './useAuthState';

export function useEvents(selectedDate?: Date) {
  const { profile, isAuthenticated } = useAuthState();
  const isApproved = profile?.is_approved;

  return useQuery({
    queryKey: ['events', selectedDate?.toISOString(), isAuthenticated, isApproved],
    queryFn: async () => {
      try {
        console.log('Fetching events with auth state:', {
          isAuthenticated,
          isApproved,
          userId: profile?.id,
          selectedDate: selectedDate?.toISOString()
        });

        // Basic query for public access (only published events)
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
          .eq('is_published', true)
          .order('date');

        // If user is authenticated and approved, modify query to show all events
        if (isAuthenticated && isApproved) {
          query = supabase
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
        }

        // Only filter by date if a date is selected
        if (selectedDate) {
          const dateStr = selectedDate.toISOString().split('T')[0];
          query = query.gte('date', dateStr);
        }

        const { data, error } = await query;
        
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
          
          // More specific error message based on the error type
          if (error.code === '401') {
            toast.error('Session expired. Please sign in again.');
          } else if (error.code === '403') {
            toast.error('You do not have permission to view these events.');
          } else {
            toast.error('Failed to load events. Please try again.');
          }
          
          throw error;
        }

        if (!data) {
          console.log('No events found');
          return [];
        }

        console.log('Successfully fetched events:', {
          count: data.length,
          firstEvent: data[0]
        });

        return transformEventData(data);
      } catch (error) {
        console.error('Error in useEvents:', error);
        toast.error('Failed to load events. Please try again.');
        throw error;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
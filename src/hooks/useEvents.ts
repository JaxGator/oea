import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { transformEventData } from './events/useEventTransform';
import type { Event } from '@/types/event';
import { toast } from 'sonner';
import { useAuthState } from './useAuthState';

export function useEvents(selectedDate?: Date) {
  const { profile } = useAuthState();
  const isApproved = profile?.is_approved;

  return useQuery({
    queryKey: ['events', selectedDate?.toISOString(), isApproved],
    queryFn: async () => {
      try {
        let query = supabase
          .from('events')
          .select(`
            id,
            title,
            description,
            date,
            time,
            end_time,
            location,
            max_guests,
            created_by,
            created_at,
            image_url,
            imported_rsvp_count,
            is_featured,
            reminder_enabled,
            reminder_intervals,
            waitlist_enabled,
            waitlist_capacity,
            is_published,
            latitude,
            longitude,
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
          query = query.gte('date', dateStr);
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

        return transformEventData(data);
      } catch (error) {
        console.error('Error in useEvents:', error);
        toast.error('Failed to load events. Please try again.');
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
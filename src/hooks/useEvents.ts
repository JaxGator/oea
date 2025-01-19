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
          .select('*')
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
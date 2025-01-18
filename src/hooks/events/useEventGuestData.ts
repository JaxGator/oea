import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useEventGuestData(eventId: string, userRSVPStatus: boolean) {
  return useQuery({
    queryKey: ['event-guests', eventId, userRSVPStatus],
    queryFn: async () => {
      try {
        if (!userRSVPStatus) {
          console.log('No RSVP status, returning empty array');
          return [];
        }
        
        console.log('Fetching RSVPs for event:', eventId);
        const { data: rsvps, error: rsvpError } = await supabase
          .from('event_rsvps')
          .select('id')
          .eq('event_id', eventId)
          .eq('response', 'attending');

        if (rsvpError) {
          console.error('Error fetching RSVPs:', rsvpError);
          throw rsvpError;
        }

        if (!rsvps?.length) {
          console.log('No RSVPs found, returning empty array');
          return [];
        }

        const rsvpIds = rsvps.map(rsvp => rsvp.id);
        console.log('Fetching guests for RSVPs:', rsvpIds);
        
        const { data: guestData, error: guestError } = await supabase
          .from('event_guests')
          .select('first_name')
          .in('rsvp_id', rsvpIds);

        if (guestError) {
          console.error('Error fetching guests:', guestError);
          throw guestError;
        }

        const guests = guestData?.map(guest => ({ firstName: guest.first_name })) || [];
        console.log('Successfully fetched guests:', guests);
        return guests;
      } catch (error) {
        console.error('Error in useEventGuestData:', error);
        throw error;
      }
    },
    enabled: !!userRSVPStatus,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000)
  });
}
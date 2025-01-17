import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useEventGuestData(eventId: string, userRSVPStatus: string | null) {
  return useQuery({
    queryKey: ['event-guests', eventId, userRSVPStatus],
    queryFn: async () => {
      try {
        if (!userRSVPStatus) return [];
        
        // First get RSVPs
        const { data: rsvps, error: rsvpError } = await supabase
          .from('event_rsvps')
          .select('id')
          .eq('event_id', eventId)
          .eq('response', 'attending');

        if (rsvpError) {
          console.error('Error fetching RSVPs:', rsvpError);
          throw rsvpError;
        }

        if (!rsvps?.length) return [];

        // Then get guests using a simpler query
        const { data: guestData, error: guestError } = await supabase
          .from('event_guests')
          .select('first_name')
          .in('rsvp_id', rsvps.map(rsvp => rsvp.id));

        if (guestError) {
          console.error('Error fetching guests:', guestError);
          throw guestError;
        }

        return guestData?.map(guest => ({ firstName: guest.first_name })) || [];
      } catch (error) {
        console.error('Error in useEventGuestData:', error);
        throw error;
      }
    },
    enabled: !!userRSVPStatus
  });
}
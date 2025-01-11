import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useEventRSVPData(eventId: string) {
  return useQuery({
    queryKey: ['total-rsvp-count', eventId],
    queryFn: async () => {
      // First get the event details
      const { data: eventData } = await supabase
        .from('events')
        .select('max_guests')
        .eq('id', eventId)
        .single();

      if (!eventData) {
        throw new Error('Event not found');
      }

      // Get all attending RSVPs
      const { data: rsvps } = await supabase
        .from('event_rsvps')
        .select(`
          id,
          status
        `)
        .eq('event_id', eventId)
        .eq('response', 'attending');

      if (!rsvps?.length) return { confirmedCount: 0, waitlistCount: 0 };

      const rsvpIds = rsvps.map(rsvp => rsvp.id);
      
      // Get guest count for these RSVPs
      const { count: guestCount } = await supabase
        .from('event_guests')
        .select('*', { count: 'exact', head: true })
        .in('rsvp_id', rsvpIds);

      // Count confirmed and waitlisted RSVPs
      const confirmedRsvps = rsvps.filter(rsvp => rsvp.status === 'confirmed').length;
      const waitlistedRsvps = rsvps.filter(rsvp => rsvp.status === 'waitlisted').length;

      return {
        confirmedCount: Math.min(confirmedRsvps + (guestCount || 0), eventData.max_guests),
        waitlistCount: Math.max(0, (confirmedRsvps + (guestCount || 0)) - eventData.max_guests) + waitlistedRsvps
      };
    }
  });
}
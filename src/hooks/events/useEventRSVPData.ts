import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useEventRSVPData(eventId: string) {
  return useQuery({
    queryKey: ['total-rsvp-count', eventId],
    queryFn: async () => {
      // First get the event details
      const { data: eventData } = await supabase
        .from('events')
        .select('max_guests, waitlist_enabled, waitlist_capacity')
        .eq('id', eventId)
        .single();

      if (!eventData) {
        console.error('Event not found');
        return { confirmedCount: 0, waitlistCount: 0 };
      }

      // Get confirmed RSVPs count
      const { count: confirmedCount } = await supabase
        .from('event_rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('response', 'attending')
        .eq('status', 'confirmed');

      // Get waitlist count if waitlist is enabled
      let waitlistCount = 0;
      if (eventData.waitlist_enabled) {
        const { count: waitlistedCount } = await supabase
          .from('event_rsvps')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', eventId)
          .eq('response', 'attending')
          .eq('status', 'waitlisted');
          
        waitlistCount = waitlistedCount || 0;
      }

      return {
        confirmedCount: confirmedCount || 0,
        waitlistCount
      };
    },
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  });
}
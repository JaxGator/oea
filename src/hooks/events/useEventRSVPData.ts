import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useEventRSVPData(eventId: string) {
  return useQuery({
    queryKey: ['total-rsvp-count', eventId],
    queryFn: async () => {
      try {
        // First get the event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('max_guests, waitlist_enabled, waitlist_capacity')
          .eq('id', eventId)
          .single();

        if (eventError) {
          console.error('Error fetching event:', eventError);
          throw eventError;
        }

        if (!eventData) {
          console.error('Event not found');
          return { confirmedCount: 0, waitlistCount: 0 };
        }

        // Get confirmed RSVPs count with error handling
        const { count: confirmedCount, error: confirmedError } = await supabase
          .from('event_rsvps')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', eventId)
          .eq('response', 'attending')
          .eq('status', 'confirmed');

        if (confirmedError) {
          console.error('Error fetching confirmed RSVPs:', confirmedError);
          throw confirmedError;
        }

        // Get waitlist count if waitlist is enabled
        let waitlistCount = 0;
        if (eventData.waitlist_enabled) {
          const { count: waitlistedCount, error: waitlistError } = await supabase
            .from('event_rsvps')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', eventId)
            .eq('response', 'attending')
            .eq('status', 'waitlisted');
            
          if (waitlistError) {
            console.error('Error fetching waitlist:', waitlistError);
            throw waitlistError;
          }

          waitlistCount = waitlistedCount || 0;
        }

        return {
          confirmedCount: confirmedCount || 0,
          waitlistCount
        };
      } catch (error) {
        console.error('Error in useEventRSVPData:', error);
        toast.error("Failed to load RSVP data. Please try again.");
        return { confirmedCount: 0, waitlistCount: 0 };
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  });
}
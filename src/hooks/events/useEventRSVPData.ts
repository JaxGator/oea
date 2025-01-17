import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useEventRSVPData(eventId: string) {
  return useQuery({
    queryKey: ['event-rsvps', eventId],
    queryFn: async () => {
      const { data: rsvps, error } = await supabase
        .from('event_rsvps')
        .select(`
          id,
          profiles (
            full_name,
            username
          ),
          event_guests (
            id,
            first_name
          )
        `)
        .eq('event_id', eventId)
        .eq('response', 'attending')
        .eq('status', 'confirmed');

      if (error) {
        console.error('Error fetching attendees:', error);
        return [];
      }

      // Transform the data to match the expected format
      return rsvps?.map(rsvp => ({
        profile: rsvp.profiles,
        event_guests: rsvp.event_guests
      })) || [];
    },
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  });
}
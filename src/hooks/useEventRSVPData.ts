
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EventRSVPWithProfile } from "@/types/database";

export function useEventRSVPData(eventId: string) {
  return useQuery({
    queryKey: ['event-rsvps', eventId],
    queryFn: async () => {
      const { data: rsvps, error } = await supabase
        .from('event_rsvps')
        .select(`
          id,
          event_id,
          user_id,
          response,
          created_at,
          status,
          profiles:profiles!event_rsvps_user_id_fkey (
            id,
            username,
            full_name,
            avatar_url
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
        throw error;
      }

      console.log('Raw RSVP data:', rsvps);

      return rsvps as EventRSVPWithProfile[];
    },
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  });
}

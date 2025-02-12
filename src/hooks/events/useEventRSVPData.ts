
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EventRSVPWithProfile } from "@/types/database.types";

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
          profiles!event_rsvps_user_id_fkey (
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
        throw error;
      }

      return (rsvps || []).map(rsvp => ({
        id: rsvp.id,
        event_id: rsvp.event_id,
        user_id: rsvp.user_id,
        response: rsvp.response,
        created_at: rsvp.created_at,
        status: rsvp.status,
        profiles: rsvp.profiles,
        event_guests: rsvp.event_guests || []
      })) as EventRSVPWithProfile[];
    },
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  });
}

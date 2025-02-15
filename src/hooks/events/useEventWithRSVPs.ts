
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event, EventRSVP } from "@/types/event";

interface RSVPWithProfile {
  id: string;
  event_id: string;
  user_id: string;
  response: 'attending' | 'not_attending' | 'maybe';
  status: 'confirmed' | 'waitlisted';
  created_at: string;
  profiles: {
    full_name: string | null;
    username: string;
  };
  event_guests?: {
    id: string;
    first_name: string;
  }[];
}

export const useEventWithRSVPs = (eventId: string | undefined) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error('Event ID is required');

      // Fetch event data with RSVPs and profiles in a single query
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select(`
          *,
          rsvps:event_rsvps(
            id,
            event_id,
            user_id,
            response,
            status,
            created_at,
            profiles (
              full_name,
              username
            ),
            event_guests (
              id,
              first_name
            )
          )
        `)
        .eq('id', eventId)
        .maybeSingle();

      if (eventError) throw eventError;
      if (!eventData) throw new Error('Event not found');

      // Process the RSVPs to the expected format
      const rsvps = (eventData.rsvps as any[])?.map((rsvp): EventRSVP => ({
        id: rsvp.id,
        event_id: rsvp.event_id,
        user_id: rsvp.user_id,
        response: rsvp.response,
        status: rsvp.status,
        created_at: rsvp.created_at,
        profiles: rsvp.profiles ? {
          full_name: rsvp.profiles.full_name,
          username: rsvp.profiles.username
        } : null,
        event_guests: rsvp.event_guests?.map(guest => ({
          id: guest.id,
          first_name: guest.first_name
        }))
      }));

      // Return the event with processed RSVPs
      return {
        ...eventData,
        rsvps: rsvps || []
      } as Event;
    },
    enabled: !!eventId
  });
};

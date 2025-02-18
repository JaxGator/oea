
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event, EventRSVP } from "@/types/event";

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
          rsvps:event_rsvps (
            id,
            event_id,
            user_id,
            response,
            status,
            created_at,
            profiles!event_rsvps_user_id_fkey (
              username,
              full_name
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
          username: rsvp.profiles.username,
          full_name: rsvp.profiles.full_name
        } : null,
        event_guests: rsvp.event_guests?.map(guest => ({
          id: guest.id,
          first_name: guest.first_name
        }))
      }));

      console.log('Processed event data:', {
        ...eventData,
        rsvps: rsvps || []
      });

      // Return the event with processed RSVPs
      return {
        ...eventData,
        rsvps: rsvps || []
      } as Event;
    },
    enabled: !!eventId
  });
};

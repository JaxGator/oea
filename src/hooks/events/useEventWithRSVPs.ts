
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event, EventRSVP } from "@/types/event";

export const useEventWithRSVPs = (eventId: string | undefined) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error('Event ID is required');

      console.log('Fetching event data for ID:', eventId);

      // Fetch event data with RSVPs and profiles in a single query
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select(`
          *,
          rsvps:event_rsvps!inner (
            id,
            event_id,
            user_id,
            response,
            status,
            created_at,
            profiles!inner (
              id,
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

      if (eventError) {
        console.error('Error fetching event data:', eventError);
        throw eventError;
      }
      
      if (!eventData) {
        console.error('No event data found for ID:', eventId);
        throw new Error('Event not found');
      }

      console.log('Raw event data:', eventData);

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

      console.log('Processed RSVPs:', rsvps);

      // Return the event with processed RSVPs
      const processedEvent = {
        ...eventData,
        rsvps: rsvps || []
      } as Event;

      console.log('Final processed event:', processedEvent);

      return processedEvent;
    },
    enabled: !!eventId
  });
};

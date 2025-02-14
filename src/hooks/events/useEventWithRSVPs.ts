
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
      if (!eventId) {
        console.warn('useEventWithRSVPs called without event ID');
        return null;
      }

      console.log('useEventWithRSVPs - Fetching event:', eventId);

      try {
        // Fetch event data
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .maybeSingle();

        if (eventError) {
          console.error('Error fetching event:', eventError);
          throw eventError;
        }
        if (!eventData) {
          console.error('Event not found for ID:', eventId);
          throw new Error('Event not found');
        }

        console.log('useEventWithRSVPs - Event data fetched:', eventData);

        // Fetch RSVPs with profiles and guests
        const { data: rsvpData, error: rsvpError } = await supabase
          .from('event_rsvps')
          .select(`
            id,
            event_id,
            user_id,
            response,
            status,
            created_at,
            profiles:profiles!inner (
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

        if (rsvpError) {
          console.error('Error fetching RSVPs:', rsvpError);
          throw rsvpError;
        }

        console.log('useEventWithRSVPs - Raw RSVP data:', rsvpData);

        const typedRsvpData = rsvpData as unknown as RSVPWithProfile[];
        
        const rsvpsWithProfiles = typedRsvpData?.map((rsvp): EventRSVP => {
          // Get the main attendee name
          const attendeeName = rsvp.profiles?.full_name || rsvp.profiles?.username || 'Unknown';
          
          return {
            id: rsvp.id,
            event_id: rsvp.event_id,
            user_id: rsvp.user_id,
            response: rsvp.response,
            status: rsvp.status,
            created_at: rsvp.created_at,
            profiles: rsvp.profiles ? {
              full_name: attendeeName,
              username: rsvp.profiles.username
            } : null,
            event_guests: rsvp.event_guests?.map(guest => ({
              id: guest.id,
              first_name: guest.first_name
            })) || []
          };
        }) || [];

        console.log('useEventWithRSVPs - Processed RSVPs:', rsvpsWithProfiles);

        const enrichedEvent = {
          ...eventData,
          rsvps: rsvpsWithProfiles,
          attendees: rsvpsWithProfiles
        } as Event;

        console.log('useEventWithRSVPs - Final enriched event:', enrichedEvent);

        return enrichedEvent;
      } catch (error) {
        console.error('useEventWithRSVPs - Error:', error);
        throw error;
      }
    },
    enabled: !!eventId,
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    gcTime: 1000 * 60 * 5 // Keep unused data in cache for 5 minutes
  });
};

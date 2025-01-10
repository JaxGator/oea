import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RSVPProfile {
  full_name: string | null;
  username: string;
}

interface RSVPWithProfile {
  id: string;
  profiles: RSVPProfile;
  event_guests: {
    id: string;
    first_name: string;
  }[];
}

interface Attendee {
  profile: {
    full_name: string | null;
    username: string;
  };
}

export function useRSVPDetails(eventId: string) {
  const { data: rsvpData } = useQuery({
    queryKey: ['event-rsvps', eventId],
    queryFn: async () => {
      // Get RSVPs with profiles and guests
      const { data: rsvps, error: rsvpError } = await supabase
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

      if (rsvpError) {
        console.error('Error fetching RSVPs:', rsvpError);
        throw rsvpError;
      }

      // Transform the data to match our expected types
      const typedRsvps = (rsvps as any[]).map(rsvp => ({
        ...rsvp,
        profiles: rsvp.profiles,
        event_guests: rsvp.event_guests || []
      })) as RSVPWithProfile[];

      // Calculate total attendees (RSVPs + guests)
      const rsvpCount = typedRsvps.reduce((total, rsvp) => {
        const guestCount = rsvp.event_guests?.length || 0;
        return total + 1 + guestCount; // Add 1 for the RSVP itself
      }, 0);

      // Get attendee names (both RSVP users and their guests)
      const attendees = typedRsvps.flatMap(rsvp => {
        const attendee: Attendee = {
          profile: {
            full_name: rsvp.profiles.full_name,
            username: rsvp.profiles.username
          }
        };
        
        const guestAttendees = rsvp.event_guests.map(guest => ({
          profile: {
            full_name: guest.first_name,
            username: guest.first_name
          }
        }));

        return [attendee, ...guestAttendees];
      });

      return {
        rsvpCount,
        attendees
      };
    }
  });

  return {
    rsvpCount: rsvpData?.rsvpCount || 0,
    attendees: rsvpData?.attendees || []
  };
}
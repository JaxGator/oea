
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const { data: rsvpData, error } = useQuery({
    queryKey: ['event-rsvps', eventId],
    queryFn: async () => {
      try {
        console.log('Fetching RSVPs for event:', eventId);
        
        // Get RSVPs with profiles and guests, using explicit foreign key relationships
        const { data: rsvps, error: rsvpError } = await supabase
          .from('event_rsvps')
          .select(`
            id,
            profiles!event_rsvps_user_id_fkey (
              full_name,
              username
            ),
            event_guests!event_guests_rsvp_id_fkey (
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

        if (!rsvps) {
          console.log('No RSVPs found for event:', eventId);
          return {
            rsvpCount: 0,
            attendees: []
          };
        }

        console.log('Fetched RSVPs:', rsvps);

        // Transform the data to match our expected types
        const typedRsvps = rsvps.map(rsvp => ({
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
      } catch (error) {
        console.error('Error in useRSVPDetails:', error);
        toast.error("Failed to load RSVP details. Please try again later.");
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (error) {
    console.error('Query error in useRSVPDetails:', error);
  }

  return {
    rsvpCount: rsvpData?.rsvpCount || 0,
    attendees: rsvpData?.attendees || [],
    isLoading: !error && !rsvpData,
    error
  };
}

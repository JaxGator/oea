import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useRSVPDetails(eventId: string) {
  const { data: rsvpData } = useQuery({
    queryKey: ['event-rsvps', eventId],
    queryFn: async () => {
      // Fetch RSVPs with profiles and guests
      const { data: rsvps, error: rsvpError } = await supabase
        .from('event_rsvps')
        .select(`
          id,
          response,
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
        .eq('response', 'attending');

      if (rsvpError) {
        console.error('Error fetching RSVPs:', rsvpError);
        throw rsvpError;
      }

      // Calculate total attendees (RSVPs + guests)
      const rsvpCount = rsvps?.reduce((total, rsvp) => {
        const guestCount = rsvp.event_guests?.length || 0;
        return total + 1 + guestCount; // Add 1 for the RSVP itself
      }, 0) || 0;

      // Get attendee names (both RSVP users and their guests)
      const attendees = rsvps?.flatMap(rsvp => {
        const attendee = {
          profile: {
            full_name: rsvp.profiles?.full_name,
            username: rsvp.profiles?.username || 'Unknown User'
          }
        };
        
        const guestAttendees = (rsvp.event_guests || []).map(guest => ({
          profile: {
            full_name: guest.first_name,
            username: guest.first_name
          }
        }));

        return [attendee, ...guestAttendees];
      }) || [];

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
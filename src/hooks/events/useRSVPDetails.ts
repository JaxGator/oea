
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types/database";

type Profile = Database['public']['Tables']['profiles']['Row'];
type EventGuest = Database['public']['Tables']['event_guests']['Row'];
type EventRSVP = Database['public']['Tables']['event_rsvps']['Row'];

interface RSVPDetails {
  id: string;
  user_id: string;
  response: string;
  status: string;
  profiles?: Profile;
  event_guests?: EventGuest[];
}

interface Attendee {
  profile: {
    full_name: string | null;
    username: string;
  };
}

interface RSVPQueryResult {
  rsvpCount: number;
  attendees: Attendee[];
}

export function useRSVPDetails(eventId: string) {
  const { data: rsvpData, error } = useQuery<RSVPQueryResult, Error>({
    queryKey: ['event-rsvps', eventId],
    queryFn: async () => {
      try {
        console.log('Fetching RSVPs for event:', eventId);
        
        const { data: rsvps, error: rsvpError } = await supabase
          .from('event_rsvps')
          .select(`
            id,
            user_id,
            response,
            status,
            profiles:profiles!event_rsvps_user_id_fkey (
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

        if (!rsvps) {
          console.log('No RSVPs found for event:', eventId);
          return {
            rsvpCount: 0,
            attendees: []
          };
        }

        console.log('Fetched RSVPs:', rsvps);

        const transformedRsvps = rsvps as RSVPDetails[];

        const rsvpCount = transformedRsvps.reduce((total, rsvp) => {
          return total + 1 + (rsvp.event_guests?.length || 0);
        }, 0);

        const attendees = transformedRsvps.flatMap(rsvp => {
          const attendee: Attendee = {
            profile: {
              full_name: rsvp.profiles?.full_name ?? null,
              username: rsvp.profiles?.username ?? ''
            }
          };
          
          const guestAttendees = rsvp.event_guests?.map(guest => ({
            profile: {
              full_name: guest.first_name,
              username: guest.first_name ?? ''
            }
          })) ?? [];

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

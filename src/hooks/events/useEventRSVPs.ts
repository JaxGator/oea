
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EventRSVP } from "@/types/event";

interface RawSupabaseRSVP {
  id: string;
  event_id: string;
  user_id: string;
  response: string;
  status: string;
  created_at: string;
  profiles: {
    id: string;
    username: string;
    full_name: string | null;
  };
  event_guests: {
    id: string;
    first_name: string;
  }[] | null;
}

export function useEventRSVPs(eventId: string | undefined) {
  return useQuery({
    queryKey: ['event-rsvps', eventId],
    queryFn: async () => {
      if (!eventId) return null;

      const { data: rawData, error } = await supabase
        .from('event_rsvps')
        .select(`
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
        `)
        .eq('event_id', eventId)
        .eq('response', 'attending')
        .eq('status', 'confirmed');

      if (error) {
        console.error('Error fetching RSVPs:', error);
        return null;
      }

      const transformedData = (rawData as unknown as RawSupabaseRSVP[]).map(rsvp => ({
        id: rsvp.id,
        event_id: rsvp.event_id,
        user_id: rsvp.user_id,
        response: rsvp.response,
        status: rsvp.status,
        created_at: rsvp.created_at,
        profiles: {
          username: rsvp.profiles.username,
          full_name: rsvp.profiles.full_name || rsvp.profiles.username
        },
        event_guests: rsvp.event_guests?.map(guest => ({
          id: guest.id,
          first_name: guest.first_name
        })) || []
      }));

      return transformedData as EventRSVP[];
    },
    enabled: !!eventId
  });
}

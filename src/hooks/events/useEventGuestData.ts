import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useEventGuestData(eventId: string, userRSVPStatus: string | null) {
  return useQuery({
    queryKey: ['event-guests', eventId, userRSVPStatus],
    queryFn: async () => {
      if (!userRSVPStatus) return [];
      
      const { data: rsvps } = await supabase
        .from('event_rsvps')
        .select('id')
        .eq('event_id', eventId)
        .eq('response', 'attending');

      if (!rsvps?.length) return [];

      const rsvpIds = rsvps.map(rsvp => rsvp.id);
      const { data: guestData } = await supabase
        .from('event_guests')
        .select('first_name')
        .in('rsvp_id', rsvpIds);

      return guestData?.map(guest => ({ firstName: guest.first_name })) || [];
    },
    enabled: !!userRSVPStatus
  });
}
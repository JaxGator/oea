import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useGuestListUpdates(eventId: string, refetchGuests: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel('event-guests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_guests',
          filter: `rsvp_id=eq.${eventId}`
        },
        async (payload) => {
          console.log('Guest list changed:', payload);
          await refetchGuests();
          
          switch (payload.eventType) {
            case 'INSERT':
              toast.success('New guest added to the event');
              break;
            case 'DELETE':
              toast.info('Guest removed from the event');
              break;
            case 'UPDATE':
              toast.info('Guest information updated');
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, refetchGuests]);
}
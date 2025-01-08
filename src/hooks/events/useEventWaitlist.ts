import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useEventWaitlist(eventId: string, waitlistEnabled: boolean = false) {
  const { data: waitlistCount = 0 } = useQuery({
    queryKey: ['waitlist-count', eventId],
    queryFn: async () => {
      if (!waitlistEnabled) return 0;
      const { count, error } = await supabase
        .from('event_rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'waitlisted');
      
      if (error) {
        console.error('Error fetching waitlist count:', error);
        return 0;
      }
      return count || 0;
    },
    enabled: !!waitlistEnabled
  });

  return { waitlistCount };
}
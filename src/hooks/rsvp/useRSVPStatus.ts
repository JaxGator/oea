import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRSVPStatus = (eventId: string) => {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: rsvpStatus } = useQuery({
    queryKey: ['rsvp-status', eventId],
    queryFn: async () => {
      if (!user) return null;

      const { data: rsvp } = await supabase
        .from('event_rsvps')
        .select('response')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      return rsvp?.response || null;
    },
    enabled: !!user
  });

  return { rsvpStatus };
};
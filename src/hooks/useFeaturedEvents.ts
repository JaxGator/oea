
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRSVPManagement } from "@/hooks/events/useRSVPManagement";
import { Event } from "@/types/event";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuthState } from "./useAuthState";
import { Database } from "@/integrations/supabase/types/database";

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type EventGuestRow = Database['public']['Tables']['event_guests']['Row'];
type EventRSVPRow = Database['public']['Tables']['event_rsvps']['Row'];

interface RSVPWithDetails extends EventRSVPRow {
  profiles: ProfileRow;
  event_guests: EventGuestRow[];
}

export const useFeaturedEvents = () => {
  const queryClient = useQueryClient();
  const { userRSVPs, handleRSVP, handleCancelRSVP } = useRSVPManagement();
  const { isAuthenticated } = useAuthState();

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['featuredEvents'],
    queryFn: async () => {
      try {
        console.log('Fetching featured events');
        const today = new Date().toISOString().split('T')[0];
        
        const eventsResult = await supabase
          .from('events')
          .select('*')
          .eq('is_published', true)
          .gte('date', today)
          .order('is_featured', { ascending: false })
          .order('date', { ascending: true });

        if (eventsResult.error) {
          console.error('Events query error:', eventsResult.error);
          throw eventsResult.error;
        }

        const eventsData = eventsResult.data || [];
        console.log('Fetched events:', eventsData);

        const rsvpsResult = await supabase
          .from('event_rsvps')
          .select(`
            id,
            user_id,
            response,
            status,
            profiles!event_rsvps_user_id_fkey (
              full_name,
              username
            ),
            event_guests!event_guests_rsvp_id_fkey (
              id,
              first_name
            )
          `)
          .in('event_id', eventsData.map(e => e.id));

        if (rsvpsResult.error) {
          console.error('RSVPs query error:', rsvpsResult.error);
          throw rsvpsResult.error;
        }

        const rsvpsData = (rsvpsResult.data || []) as RSVPWithDetails[];
        console.log('Fetched RSVPs:', rsvpsData);

        const eventsWithRSVPs = eventsData.map(event => ({
          ...event,
          rsvps: rsvpsData.filter(rsvp => rsvp.event_id === event.id) || [],
          attendees: rsvpsData.filter(rsvp => 
            rsvp.event_id === event.id && 
            rsvp.response === 'attending' && 
            rsvp.status === 'confirmed'
          ) || [],
          guests: []
        })) satisfies Event[];

        return eventsWithRSVPs;
      } catch (error) {
        console.error('Featured events query error:', error);
        toast.error("Failed to load events. Please try again later.");
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    console.log('Setting up real-time subscription for events');
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          console.log('Event change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['featuredEvents'] });
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up events subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    events: events as Event[],
    isLoading,
    error,
    userRSVPs: isAuthenticated ? userRSVPs : {},
    handleRSVP: isAuthenticated ? handleRSVP : () => {
      toast.error("Please log in to RSVP for events");
    },
    handleCancelRSVP: isAuthenticated ? handleCancelRSVP : () => {
      toast.error("Please log in to manage your RSVPs");
    },
  };
};

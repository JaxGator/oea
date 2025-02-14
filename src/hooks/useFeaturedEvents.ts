
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRSVPManagement } from "@/hooks/events/useRSVPManagement";
import { Event } from "@/types/event";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuthState } from "./useAuthState";
import { Database } from "@/integrations/supabase/types/database";

type EventResponseRow = Database['public']['Tables']['events']['Row'] & {
  event_rsvps?: Array<{
    id: string;
    user_id: string;
    response: string;
    status: string;
    profiles?: {
      full_name: string | null;
      username: string;
    };
    event_guests?: Array<{
      id: string;
      first_name: string | null;
    }>;
  }>;
};

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
          .select(`
            *,
            event_rsvps!event_rsvps_event_id_fkey (
              id,
              user_id,
              response,
              status,
              profiles!event_rsvps_user_id_fkey (
                full_name,
                username
              ),
              event_guests (
                id,
                first_name
              )
            )
          `)
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

        const eventsWithRSVPs = (eventsData as EventResponseRow[]).map(event => ({
          ...event,
          rsvps: event.event_rsvps || [],
          attendees: event.event_rsvps?.filter(rsvp => 
            rsvp.response === 'attending' && 
            rsvp.status === 'confirmed'
          ) || [],
          guests: event.event_rsvps?.flatMap(rsvp => 
            rsvp.event_guests || []
          ) || []
        })) as Event[];

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

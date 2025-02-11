
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRSVPManagement } from "@/hooks/events/useRSVPManagement";
import { Event } from "@/types/event";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuthState } from "./useAuthState";
import { EventWithRSVPs, isEventWithRSVPs, isQueryError, transformEventData } from "@/integrations/supabase/types/database-types";

export const useFeaturedEvents = () => {
  const queryClient = useQueryClient();
  const { userRSVPs, handleRSVP, handleCancelRSVP } = useRSVPManagement();
  const { isAuthenticated } = useAuthState();

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['featuredEvents'],
    queryFn: async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // First, get the events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('is_published', true)
          .gte('date', today)
          .order('is_featured', { ascending: false })
          .order('date', { ascending: true });

        if (eventsError) throw eventsError;
        if (!eventsData) return [];

        // Then, get RSVPs for these events
        const { data: rsvpsData, error: rsvpsError } = await supabase
          .from('event_rsvps')
          .select(`
            *,
            profiles (
              full_name,
              username
            )
          `)
          .in('event_id', eventsData.map(e => e.id));

        if (rsvpsError) throw rsvpsError;

        // Combine the data
        const eventsWithRSVPs = eventsData.map(event => ({
          ...event,
          event_rsvps: rsvpsData?.filter(rsvp => rsvp.event_id === event.id) || []
        }));

        // Transform to Event type
        return eventsWithRSVPs.map((event): Event => ({
          ...event,
          rsvps: event.event_rsvps || [],
          attendees: event.event_rsvps?.filter(rsvp => 
            rsvp.response === 'attending' && rsvp.status === 'confirmed'
          ) || [],
          guests: []
        }));
      } catch (error) {
        console.error('Query error:', error);
        if (isQueryError(error)) {
          toast.error(`Database error: ${error.message}`);
        } else {
          toast.error('Failed to fetch events');
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    gcTime: 1000 * 60 * 10, // Keep unused data for 10 minutes
  });

  // Set up real-time subscription for events
  useEffect(() => {
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    events: events || [],
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

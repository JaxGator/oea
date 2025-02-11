
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRSVPManagement } from "@/hooks/events/useRSVPManagement";
import { Event } from "@/types/event";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuthState } from "./useAuthState";

export const useFeaturedEvents = () => {
  const queryClient = useQueryClient();
  const { userRSVPs, handleRSVP, handleCancelRSVP } = useRSVPManagement();
  const { isAuthenticated } = useAuthState();

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['featuredEvents'],
    queryFn: async () => {
      console.log('Fetching featured events...');
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select(`
            *,
            event_rsvps!event_rsvps_event_id_fkey (
              id,
              event_id,
              user_id,
              response,
              created_at,
              status
            )
          `)
          .eq('is_published', true)
          .gte('date', today)
          .order('is_featured', { ascending: false })
          .order('date', { ascending: true });

        if (eventsError) {
          console.error('Error fetching events:', eventsError);
          throw eventsError;
        }

        if (!eventsData) {
          console.log('No events found');
          return [];
        }

        // Transform the data to match our Event type
        const transformedEvents = eventsData.map((event): Event => ({
          ...event,
          rsvps: event.event_rsvps || [],
          attendees: event.event_rsvps?.filter(rsvp => 
            rsvp.response === 'attending' && rsvp.status === 'confirmed'
          ) || [],
          guests: []
        }));

        console.log('Fetched and transformed events:', transformedEvents);
        return transformedEvents;
      } catch (error) {
        console.error('Query error:', error);
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
      console.log('Cleaning up event subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (error) {
    console.error('Error in useFeaturedEvents:', error);
    toast.error('Failed to load events');
  }

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

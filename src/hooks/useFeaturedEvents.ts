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
        
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            event_rsvps (
              id,
              event_id,
              user_id,
              response,
              created_at,
              profiles (
                full_name,
                username
              )
            )
          `)
          .eq('is_published', true)
          .gte('date', today)
          .order('is_featured', { ascending: false })
          .order('date', { ascending: true });

        if (error) {
          console.error('Error fetching events:', error);
          throw error;
        }

        console.log('Fetched events:', data);
        return data as Event[];
      } catch (error) {
        console.error('Query error:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false
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
        () => {
          queryClient.invalidateQueries({ queryKey: ['featuredEvents'] });
        }
      )
      .subscribe();

    return () => {
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
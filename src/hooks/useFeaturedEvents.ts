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
    retry: 1,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (events.length > 0) {
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'events'
          },
          (payload) => {
            console.log('Event change received:', payload);
            queryClient.invalidateQueries({ queryKey: ['featuredEvents'] });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [events.length, queryClient]);

  if (error) {
    console.error('Error in useFeaturedEvents:', error);
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
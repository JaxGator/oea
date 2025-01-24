import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRSVPManagement } from "@/hooks/events/useRSVPManagement";
import { Event } from "@/types/event";
import { useEffect } from "react";
import { toast } from "sonner";

export const useFeaturedEvents = () => {
  const queryClient = useQueryClient();
  const { userRSVPs, handleRSVP, handleCancelRSVP } = useRSVPManagement();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['featuredEvents'],
    queryFn: async () => {
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
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      return data || [];
    },
  });

  useEffect(() => {
    // Subscribe to real-time changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          console.log('New event created:', payload);
          
          // Show a toast notification
          toast.success('New event has been added!');
          
          // Invalidate and refetch the events query
          queryClient.invalidateQueries({ queryKey: ['featuredEvents'] });
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    events,
    isLoading,
    userRSVPs,
    handleRSVP,
    handleCancelRSVP,
  };
};
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRSVPManagement } from "@/hooks/events/useRSVPManagement";
import { Event } from "@/types/event";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

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
          event: '*',
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          console.log('Event change received:', payload);
          
          if (payload.eventType === 'UPDATE') {
            // Show toast notification for updates
            toast({
              title: "Event Updated",
              description: `The event "${payload.new.title}" has been updated.`
            });
            
            // Invalidate and refetch the events query
            queryClient.invalidateQueries({ queryKey: ['featuredEvents'] });
          } else if (payload.eventType === 'DELETE') {
            // Show toast notification for deletions
            toast({
              title: "Event Deleted",
              description: `An event has been removed from the calendar.`,
              variant: "destructive"
            });
            
            // Remove the deleted event from the cache
            queryClient.setQueryData(['featuredEvents'], (oldData: Event[] | undefined) => {
              if (!oldData) return [];
              return oldData.filter(event => event.id !== payload.old.id);
            });
          }
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
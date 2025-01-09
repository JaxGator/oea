import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { transformEventData } from "./useEventTransform";
import { Event } from "@/types/event";

export const fetchFeaturedEvents = async (): Promise<Event[]> => {
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
    .gte('date', today)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching featured events:', error);
    throw error;
  }

  return transformEventData(data || []);
};

export const useEventFetch = () => {
  return useQuery({
    queryKey: ['featuredEvents'],
    queryFn: fetchFeaturedEvents,
  });
};
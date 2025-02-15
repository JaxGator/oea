
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { transformEventData } from "./useEventTransform";
import { Event } from "@/types/event";
import { startOfDay } from "date-fns";

export const fetchFeaturedEvents = async (): Promise<Event[]> => {
  // Get today's date at the start of the day for accurate comparison
  const today = startOfDay(new Date()).toISOString();
  console.log('Fetching events from:', today);
  
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
    .gte('date', today.split('T')[0])
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching featured events:', error);
    throw error;
  }

  console.log('Fetched events:', data);
  return transformEventData(data || []);
};

export const useEventFetch = () => {
  return useQuery({
    queryKey: ['featuredEvents'],
    queryFn: fetchFeaturedEvents,
  });
};

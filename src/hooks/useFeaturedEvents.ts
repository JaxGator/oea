import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";

interface EventWithRSVPs extends Omit<Event, 'created_by'> {
  created_by: {
    username: string;
  };
  rsvps: Array<{
    id: string;
    event_id: string;
    user_id: string;
    response: string;
    created_at: string;
  }>;
}

const fetchFeaturedEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      id,
      title,
      description,
      date,
      time,
      location,
      max_guests,
      image_url,
      created_at,
      created_by:profiles!events_created_by_fkey (
        username
      ),
      rsvps:event_rsvps (
        id,
        event_id,
        user_id,
        response,
        created_at
      )
    `)
    .order('date', { ascending: true })
    .limit(3);

  if (error) {
    console.error('Error fetching featured events:', error);
    throw error;
  }

  // Transform and type-check the data
  const transformedData = (data || []).map((event: any): Event => ({
    ...event,
    created_by: {
      username: event.created_by?.[0]?.username || 'Unknown'
    },
    rsvps: event.rsvps || []
  }));

  return transformedData;
};

export function useFeaturedEvents() {
  return useQuery({
    queryKey: ['featuredEvents'],
    queryFn: fetchFeaturedEvents,
  });
}
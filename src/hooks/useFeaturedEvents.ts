
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { useRSVPManagement } from "@/hooks/events/useRSVPManagement";
import type { Event } from "@/types/event";

interface EventsPage {
  data: Event[];
  count: number;
}

export function useFeaturedEvents() {
  const { isAuthenticated } = useAuthState();
  const { userRSVPs, handleRSVP, handleCancelRSVP } = useRSVPManagement();

  const query = useInfiniteQuery<EventsPage>({
    queryKey: ['featured-events'],
    queryFn: async ({ pageParam = 0 }) => {
      console.log('Fetching featured events, page:', pageParam);

      const from = pageParam * 10;
      const to = from + 9;

      // First get the count of all events
      const { count: totalCount, error: countError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true);

      if (countError) {
        console.error('Error getting event count:', countError);
        throw countError;
      }

      // Then fetch the events with their RSVPs
      const { data: events, error } = await supabase
        .from('events')
        .select(`
          *,
          rsvps:event_rsvps(
            id,
            user_id,
            response,
            status,
            created_at,
            profiles:profiles!inner (
              full_name,
              username
            ),
            event_guests (
              id,
              first_name
            )
          )
        `)
        .eq('is_featured', true)
        .order('date', { ascending: true })
        .range(from, to);

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      console.log('Featured events fetched:', events);

      return {
        data: events as Event[],
        count: totalCount || 0
      };
    },
    getNextPageParam: (lastPage, pages) => {
      const hasNextPage = pages.length * 10 < lastPage.count;
      return hasNextPage ? pages.length : null;
    },
    enabled: true,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  const events = query.data?.pages.flatMap(page => page.data) || [];

  console.log('useFeaturedEvents - Final events:', {
    events,
    rsvpCount: events.map(e => e.rsvps?.length || 0),
    isLoading: query.isLoading,
    error: query.error
  });

  return {
    events,
    isLoading: query.isLoading,
    error: query.error,
    userRSVPs,
    handleRSVP,
    handleCancelRSVP,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage
  };
}

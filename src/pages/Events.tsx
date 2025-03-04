
import { useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useRSVP } from "@/hooks/useRSVP";
import { useAuthState } from "@/hooks/useAuthState";
import { EventsHeader } from "@/components/event/sections/EventsHeader";
import { EventsContent } from "@/components/event/sections/EventsContent";
import { useQueryClient } from "@tanstack/react-query";
import { endOfDay, parseISO, startOfDay, set } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Event, EventsPage } from "@/types/database";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/ui/loading-screen";

export default function Events() {
  const { isAuthenticated, profile } = useAuthState();
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const queryClient = useQueryClient();
  
  const { 
    data: eventsData, 
    isLoading: isEventsLoading, 
    error,
  } = useEvents(selectedDate);

  const { handleRSVP, cancelRSVP } = useRSVP();

  // Fetch RSVPs for all events
  const { data: eventsWithRSVPs, isLoading: isRSVPsLoading } = useQuery({
    queryKey: ['events-with-rsvps'],
    queryFn: async () => {
      if (!eventsData?.pages?.[0]?.data) return [];

      const eventIds = eventsData.pages[0].data.map(e => e.id);
      
      if (eventIds.length === 0) return [];
      
      try {
        const { data: rsvpsData, error } = await supabase
          .from('event_rsvps')
          .select(`
            event_id,
            response,
            status,
            profiles:profiles (
              username,
              full_name
            ),
            event_guests (
              id,
              first_name
            )
          `)
          .in('event_id', eventIds);

        if (error) {
          console.error('Error fetching RSVPs:', error);
          return [];
        }

        // Group RSVPs by event
        const rsvpsByEvent = rsvpsData.reduce((acc, rsvp) => {
          if (!acc[rsvp.event_id]) {
            acc[rsvp.event_id] = [];
          }
          acc[rsvp.event_id].push(rsvp);
          return acc;
        }, {} as Record<string, any[]>);

        // Merge events with their RSVPs
        return eventsData.pages[0].data.map(event => ({
          ...event,
          rsvps: rsvpsByEvent[event.id] || []
        }));
      } catch (error) {
        console.error('Failed to fetch RSVPs:', error);
        return eventsData.pages[0].data || [];
      }
    },
    enabled: !!eventsData?.pages?.[0]?.data?.length,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // Fetch user's RSVP statuses
  const { data: userRSVPs, isLoading: isUserRSVPsLoading } = useQuery({
    queryKey: ['user-rsvps', eventsData?.pages?.[0]?.data?.map(e => e.id)],
    queryFn: async () => {
      if (!profile?.id || !eventsData?.pages?.[0]?.data) return null;

      const eventIds = eventsData.pages[0].data.map(e => e.id);
      
      if (eventIds.length === 0) return {};
      
      try {
        const { data, error } = await supabase
          .from('event_rsvps')
          .select('event_id, response, status')
          .eq('user_id', profile.id)
          .in('event_id', eventIds);

        if (error) {
          console.error('Error fetching user RSVPs:', error);
          return null;
        }

        return data.reduce((acc, rsvp) => ({
          ...acc,
          [rsvp.event_id]: rsvp.response
        }), {} as Record<string, string>);
      } catch (error) {
        console.error('Failed to fetch RSVPs:', error);
        return null;
      }
    },
    enabled: !!isAuthenticated && !!profile?.id && !!eventsData?.pages?.[0]?.data?.length,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  const isLoading = isEventsLoading || isRSVPsLoading || isUserRSVPsLoading;

  // Show a full-page loading state on initial load
  if (isLoading && !eventsWithRSVPs) {
    return <LoadingScreen message="Loading events..." />;
  }

  const allEvents = eventsWithRSVPs || eventsData?.pages?.flatMap(page => (page as EventsPage).data) || [];
  const totalCount = eventsData?.pages?.[0] ? (eventsData.pages[0] as EventsPage).count : 0;

  const filteredEvents = selectedDate ? allEvents : allEvents;
  
  const now = new Date();
  const startOfToday = startOfDay(now);

  const upcomingEvents = filteredEvents.filter(event => {
    const eventDate = parseISO(event.date);
    return endOfDay(eventDate) >= startOfToday;
  }) as Event[];

  const pastEvents = filteredEvents.filter(event => {
    const eventDate = parseISO(event.date);
    return endOfDay(eventDate) < startOfToday;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) as Event[];

  const isEventPast = (event: Event) => {
    const [hours, minutes] = event.time.split(':').map(Number);
    const eventDateTime = set(parseISO(event.date), {
      hours: hours || 0,
      minutes: minutes || 0,
    });
    return eventDateTime < now;
  };

  const handleEventUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['events'] });
  };

  if (error) {
    console.error("Events loading error:", error);
    toast.error("Failed to load events. Please try again.");
    return (
      <div className="min-h-screen bg-[#F1F0FB] flex items-center justify-center animate-fade-in">
        <div className="text-black p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Error Loading Events</h3>
          <p>We couldn't load the events. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EventsHeader
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          isAuthenticated={isAuthenticated}
          onCreateEvent={() => setIsCreateEventOpen(true)}
        />

        <EventsContent
          upcomingEvents={upcomingEvents.map(event => ({
            ...event,
            isPastEvent: isEventPast(event)
          }))}
          pastEvents={pastEvents}
          onRSVP={handleRSVP}
          onCancelRSVP={cancelRSVP}
          isLoading={isLoading}
          onUpdate={handleEventUpdate}
          userRSVPs={userRSVPs || {}}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
}

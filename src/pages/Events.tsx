
import { useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useRSVP } from "@/hooks/useRSVP";
import { useAuthState } from "@/hooks/useAuthState";
import { EventsHeader } from "@/components/event/sections/EventsHeader";
import { EventsContent } from "@/components/event/sections/EventsContent";
import { useQueryClient } from "@tanstack/react-query";
import type { Event, EventsPage } from "@/types/database";

export default function Events() {
  const { isAuthenticated } = useAuthState();
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const queryClient = useQueryClient();
  
  const { 
    data: eventsData, 
    isLoading: isEventsLoading, 
    error,
  } = useEvents(selectedDate);

  const { handleRSVP, cancelRSVP } = useRSVP();

  const allEvents = eventsData?.pages?.flatMap(page => (page as EventsPage).data) || [];
  const totalCount = eventsData?.pages?.[0] ? (eventsData.pages[0] as EventsPage).count : 0;

  const filteredEvents = selectedDate ? allEvents : allEvents;
  
  const now = new Date();
  const upcomingEvents = filteredEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= now;
  }) as Event[];

  const pastEvents = filteredEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate < now;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) as Event[];

  console.log('Events page - Upcoming events:', upcomingEvents);
  console.log('Events page - Past events:', pastEvents);

  const handleEventUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['events'] });
  };

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
          upcomingEvents={upcomingEvents}
          pastEvents={pastEvents}
          onRSVP={handleRSVP}
          onCancelRSVP={cancelRSVP}
          isLoading={isEventsLoading}
          onUpdate={handleEventUpdate}
        />
      </div>
    </div>
  );
}

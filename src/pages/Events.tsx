
import { useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useRSVP } from "@/hooks/useRSVP";
import { useAuthState } from "@/hooks/useAuthState";
import { EventsHeader } from "@/components/event/sections/EventsHeader";
import { EventsContent } from "@/components/event/sections/EventsContent";
import { useQueryClient } from "@tanstack/react-query";

export default function Events() {
  const { isAuthenticated } = useAuthState();
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const queryClient = useQueryClient();
  
  const { 
    data, 
    isLoading: isEventsLoading, 
    error,
  } = useEvents(selectedDate);
  
  const { handleRSVP, cancelRSVP } = useRSVP();

  const events = data?.pages.flatMap(page => page.events) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  const filteredEvents = selectedDate ? events : events;
  
  const now = new Date();
  const upcomingEvents = filteredEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= now;
  });

  const pastEvents = filteredEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate < now;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleEventUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['events'] });
  };

  if (error) {
    console.error("Events loading error:", error);
    return (
      <div className="min-h-screen bg-[#F1F0FB] flex items-center justify-center animate-fade-in">
        <div className="text-black">Error loading events. Please try again.</div>
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

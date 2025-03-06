
import { useState, useEffect } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useRSVPManagement } from "@/hooks/events/useRSVPManagement";
import { EventsHeader } from "@/components/event/sections/EventsHeader";
import { EventsContent } from "@/components/event/sections/EventsContent";
import { useAuthState } from "@/hooks/useAuthState";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Event } from "@/types/event";

export default function Events() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  // Remove argument from useEvents call
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    refetch
  } = useEvents();
  
  const { userRSVPs, handleRSVP, handleCancelRSVP } = useRSVPManagement();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthState();
  
  // Set page title
  usePageTitle("Events");

  // Flatten the pages of events into a single array
  const events = data?.pages.flatMap(page => page.data) || [];
  
  // Filter events by date if selected
  const filteredEvents = selectedDate ? events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= selectedDate;
  }) : events;
  
  // Separate upcoming and past events
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = filteredEvents.filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });
  
  const pastEvents = filteredEvents.filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < today;
  });
  
  // Log current state for debugging
  useEffect(() => {
    console.log("Events page state:", { 
      eventsCount: events.length,
      isAuthLoading,
      isAuthenticated,
      selectedDate,
      hasUserRSVPs: Object.keys(userRSVPs).length > 0
    });
  }, [events.length, isAuthLoading, isAuthenticated, selectedDate, userRSVPs]);

  return (
    <div className="min-h-screen bg-[#222222]">
      <div className="max-w-7xl mx-auto p-4 pt-8">
        <EventsHeader
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          isAuthenticated={isAuthenticated}
          onCreateEvent={() => refetch()}
        />
        
        <EventsContent 
          upcomingEvents={upcomingEvents}
          pastEvents={pastEvents}
          onRSVP={handleRSVP}
          onCancelRSVP={handleCancelRSVP}
          isLoading={isLoading}
          onUpdate={() => refetch()}
          userRSVPs={userRSVPs}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
}

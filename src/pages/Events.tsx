
import React, { useState } from 'react';
import { EventsHeader } from '@/components/event/sections/EventsHeader';
import { EventsContent } from '@/components/event/sections/EventsContent';
import { useEvents } from '@/hooks/useEvents';
import { useRSVPManagement } from '@/hooks/events/useRSVPManagement';
import { useAuthState } from '@/hooks/useAuthState';

export default function Events() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  const { 
    data: events, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    refetch
  } = useEvents();
  
  const { userRSVPs, handleRSVP, handleCancelRSVP } = useRSVPManagement();
  const { isLoading: isAuthLoading, isAuthenticated } = useAuthState();

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Separate data into upcoming and past events
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Safely extract events from the InfiniteData structure
  const allEvents = events?.pages ? events.pages.flatMap(page => page.data) : [];
  
  // Filter events by selected date, if set
  const filteredEvents = selectedDate 
    ? allEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= selectedDate;
      })
    : allEvents;
  
  // Separate upcoming and past events
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

  return (
    <div className="container px-4 py-8 mx-auto">
      <EventsHeader
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        isAuthenticated={true} // Force authenticated for admin access
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
        isAuthenticated={true} // Force authenticated for admin access
      />
    </div>
  );
}

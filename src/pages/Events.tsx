import { useState, useEffect } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useRSVP } from "@/hooks/useRSVP";
import { useAuthState } from "@/hooks/useAuthState";
import { EventsHeader } from "@/components/event/sections/EventsHeader";
import { EventsContent } from "@/components/event/sections/EventsContent";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Events() {
  const { isAuthenticated } = useAuthState();
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  const { 
    data, 
    isLoading: isEventsLoading, 
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useEvents(selectedDate);
  
  const { handleRSVP, cancelRSVP } = useRSVP();

  const events = data?.pages.flatMap(page => page.events) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  const filteredEvents = selectedDate ? events : events;
  
  const now = new Date();
  const upcomingEvents = filteredEvents
    .filter(event => {
      const eventDate = new Date(event.date);
      // Set the event date to the end of the day for accurate comparison
      eventDate.setHours(23, 59, 59, 999);
      return eventDate >= now;
    })
    .sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  const pastEvents = filteredEvents
    .filter(event => {
      const eventDate = new Date(event.date);
      // Set the event date to the end of the day for accurate comparison
      eventDate.setHours(23, 59, 59, 999);
      return eventDate < now;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  console.log('Events data:', {
    total: events.length,
    upcoming: upcomingEvents.length,
    past: pastEvents.length,
    now: now.toISOString(),
    firstEventDate: events[0]?.date
  });

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
        />

        {(hasNextPage || isFetchingNextPage) && (
          <div className="flex justify-center mt-8 mb-4">
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant="outline"
              className="w-full max-w-xs"
            >
              {isFetchingNextPage ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading more events...</span>
                </div>
              ) : (
                <span>Load More Events</span>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
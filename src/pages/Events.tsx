import { useState, useEffect } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useRSVP } from "@/hooks/useRSVP";
import { useAuthState } from "@/hooks/useAuthState";
import { EventsHeader } from "@/components/event/sections/EventsHeader";
import { EventsContent } from "@/components/event/sections/EventsContent";
import { filterEventsByDate } from "@/utils/dateUtils";
import { useInView } from "react-intersection-observer";
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

  // Set up intersection observer for infinite scroll
  const { ref, inView } = useInView();

  // Load more events when the user scrolls to the bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Combine all pages of events
  const events = data?.pages.flatMap(page => page.events) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  // Only filter by date if a date is selected
  const filteredEvents = selectedDate ? filterEventsByDate(events, selectedDate) : events;
  
  // Separate upcoming and past events, with featured events first
  const now = new Date();
  const upcomingEvents = filteredEvents
    .filter(event => new Date(event.date) >= now)
    .sort((a, b) => {
      // Sort featured events first
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      // Then sort by date
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  const pastEvents = filteredEvents
    .filter(event => new Date(event.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (error) {
    console.error("Events loading error:", error);
    return (
      <div className="min-h-screen bg-[#F1F0FB] flex items-center justify-center">
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

        {/* Infinite scroll trigger */}
        <div ref={ref} className="h-10 flex items-center justify-center">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading more events...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
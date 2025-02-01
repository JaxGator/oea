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

  const { ref, inView } = useInView({
    threshold: 0.5,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log('Loading more events...');
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const events = data?.pages.flatMap(page => page.events) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  const filteredEvents = selectedDate ? filterEventsByDate(events, selectedDate) : events;
  
  const now = new Date();
  const upcomingEvents = filteredEvents
    .filter(event => new Date(event.date) >= now)
    .sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  const pastEvents = filteredEvents
    .filter(event => new Date(event.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
          <div 
            ref={ref} 
            className="h-20 flex items-center justify-center mt-8 animate-fade-in"
          >
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">Loading more events...</span>
              </div>
            ) : (
              <div className="h-10" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
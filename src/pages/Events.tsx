
import { useState, useEffect } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useRSVPManagement } from "@/hooks/events/useRSVPManagement";
import { EventsHeader } from "@/components/event/sections/EventsHeader";
import { EventsContent } from "@/components/event/sections/EventsContent";
import { useAuthState } from "@/hooks/useAuthState";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Events() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    refetch
  } = useEvents(selectedDate);
  
  const { userRSVPs, handleRSVP, handleCancelRSVP } = useRSVPManagement();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthState();
  
  // Set page title
  usePageTitle("Events");

  // Flatten the pages of events into a single array
  const events = data?.pages.flatMap(page => page.data) || [];
  
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
          events={events}
          isLoading={isLoading}
          onLoadMore={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          hasMore={!!hasNextPage}
          isLoadingMore={isFetchingNextPage}
          userRSVPs={userRSVPs}
          isAuthLoading={isAuthLoading}
          isAuthenticated={isAuthenticated}
          handleRSVP={handleRSVP}
          handleCancelRSVP={handleCancelRSVP}
        />
      </div>
    </div>
  );
}

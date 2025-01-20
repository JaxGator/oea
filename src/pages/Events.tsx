import { useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useRSVP } from "@/hooks/useRSVP";
import { useAuthState } from "@/hooks/useAuthState";
import { EventsHeader } from "@/components/event/sections/EventsHeader";
import { EventsContent } from "@/components/event/sections/EventsContent";
import { EventCalendarView } from "@/components/event/calendar/EventCalendarView";
import { EventViewToggle } from "@/components/event/EventViewToggle";
import { filterEventsByDate } from "@/utils/dateUtils";

type ViewMode = "grid" | "calendar";

export default function Events() {
  const { isAuthenticated } = useAuthState();
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  
  const { data: events = [], isLoading: isEventsLoading, error } = useEvents(selectedDate);
  const { handleRSVP, cancelRSVP } = useRSVP();

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

  const handleEventClick = (eventId: string) => {
    // Handle event click - you might want to show event details or navigate
    console.log("Event clicked:", eventId);
  };

  if (error) {
    console.error("Events loading error:", error);
    return (
      <div className="min-h-screen bg-[#F1F0FB] flex items-center justify-center">
        <div className="text-black">Error loading events. Please try again.</div>
      </div>
    );
  }

  if (isEventsLoading) {
    return (
      <div className="min-h-screen bg-[#F1F0FB] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <EventsHeader
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              isAuthenticated={isAuthenticated}
              onCreateEvent={() => setIsCreateEventOpen(true)}
            />
            <EventViewToggle
              currentView={viewMode}
              onViewChange={setViewMode}
            />
          </div>

          {viewMode === "calendar" ? (
            <EventCalendarView
              events={upcomingEvents}
              onEventClick={handleEventClick}
            />
          ) : (
            <EventsContent
              upcomingEvents={upcomingEvents}
              pastEvents={pastEvents}
              onRSVP={handleRSVP}
              onCancelRSVP={cancelRSVP}
            />
          )}
        </div>
      </div>
    </div>
  );
}
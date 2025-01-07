import { useState } from "react";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { DateFilter } from "@/components/DateFilter";
import { useEvents } from "@/hooks/useEvents";
import { EventList } from "@/components/event/EventList";
import { EventsMap } from "@/components/event/EventsMap";
import { useRSVP } from "@/hooks/useRSVP";
import { toast } from "sonner";
import { useAuthState } from "@/hooks/useAuthState";
import { Loader2, CalendarDays, CalendarRange, CalendarFold } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { isSameDay, isDateInWeekendRange } from "@/utils/dateUtils";

export default function Events() {
  const { isAuthenticated } = useAuthState();
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  
  const { data: events = [], isLoading: isEventsLoading, error } = useEvents(selectedDate);
  const { handleRSVP, cancelRSVP } = useRSVP();

  const filterEvents = (events: any[], date: Date | undefined) => {
    if (!date) return events;

    return events.filter(event => {
      const eventDate = new Date(event.date);
      // For "Today" filter
      if (isSameDay(eventDate, date)) return true;
      
      // For "This Weekend" filter (Friday through Sunday)
      if (date.getDay() === 5) { // If the selected date is a Friday
        return isDateInWeekendRange(eventDate, date);
      }
      
      return false;
    });
  };

  if (error) {
    console.error("Events loading error:", error);
    toast.error("Failed to load events. Please try again.");
    return (
      <div className="min-h-screen bg-[#F1F0FB] flex items-center justify-center">
        <div className="text-black">Error loading events. Please try again.</div>
      </div>
    );
  }

  if (isEventsLoading) {
    return (
      <div className="min-h-screen bg-[#F1F0FB] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const now = new Date();
  const filteredEvents = selectedDate ? filterEvents(events, selectedDate) : events;
  
  const upcomingEvents = filteredEvents
    .filter(event => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = filteredEvents
    .filter(event => new Date(event.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
          <CalendarRange className="h-8 w-8" />
          Events
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <CalendarDays className="h-6 w-6" />
                Upcoming Events
              </h2>
              <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                <DateFilter
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
                {isAuthenticated && (
                  <Button 
                    onClick={() => setIsCreateEventOpen(true)}
                    className="bg-[#0d97d1] hover:bg-[#0d97d1]/90 w-full sm:w-auto"
                  >
                    Create Event
                  </Button>
                )}
              </div>
            </div>

            {upcomingEvents.length > 0 && (
              <div className="mb-8">
                <ErrorBoundary fallback={<div>Error loading map. Please try again later.</div>}>
                  <EventsMap events={upcomingEvents} />
                </ErrorBoundary>
              </div>
            )}

            <ErrorBoundary fallback={<div>Error loading events. Please try again later.</div>}>
              <EventList 
                events={upcomingEvents}
                onRSVP={handleRSVP}
                onCancelRSVP={cancelRSVP}
              />
            </ErrorBoundary>
          </div>

          {pastEvents.length > 0 && (
            <div className="border-t p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <CalendarFold className="h-6 w-6" />
                Past Events
              </h2>
              <ErrorBoundary fallback={<div>Error loading past events. Please try again later.</div>}>
                <EventList 
                  events={pastEvents}
                  onRSVP={handleRSVP}
                  onCancelRSVP={cancelRSVP}
                />
              </ErrorBoundary>
            </div>
          )}
        </div>

        <CreateEventDialog
          open={isCreateEventOpen}
          onOpenChange={setIsCreateEventOpen}
        />
      </div>
    </div>
  );
}

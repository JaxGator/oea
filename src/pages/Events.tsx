import { useState } from "react";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { useEvents } from "@/hooks/useEvents";
import { useRSVP } from "@/hooks/useRSVP";
import { toast } from "sonner";
import { useAuthState } from "@/hooks/useAuthState";
import { Loader2, CalendarRange } from "lucide-react";
import { isSameDay, isDateInWeekendRange } from "@/utils/dateUtils";
import { EventsHeader } from "@/components/event/sections/EventsHeader";
import { EventsContent } from "@/components/event/sections/EventsContent";

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
      if (isSameDay(eventDate, date)) return true;
      
      if (date.getDay() === 5) { // If selected date is Friday
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
            />
          </div>
        </div>

        <CreateEventDialog
          open={isCreateEventOpen}
          onOpenChange={setIsCreateEventOpen}
        />
      </div>
    </div>
  );
}
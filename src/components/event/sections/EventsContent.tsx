import { Event } from "@/types/event";
import { EventList } from "@/components/event/EventList";
import { EventsMap } from "@/components/event/EventsMap";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { CalendarFold } from "lucide-react";
import { useState } from "react";

interface EventsContentProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
  onRSVP: (eventId: string, guests?: { firstName: string }[]) => Promise<void>;
  onCancelRSVP: (eventId: string) => Promise<void>;
}

export function EventsContent({
  upcomingEvents,
  pastEvents,
  onRSVP,
  onCancelRSVP,
}: EventsContentProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId === selectedEventId ? null : eventId);
  };

  return (
    <>
      {upcomingEvents.length > 0 && (
        <div className="mb-8">
          <ErrorBoundary fallback={<div>Error loading map. Please try again later.</div>}>
            <EventsMap 
              events={upcomingEvents} 
              selectedEventId={selectedEventId}
            />
          </ErrorBoundary>
        </div>
      )}

      <ErrorBoundary fallback={<div>Error loading events. Please try again later.</div>}>
        <EventList 
          events={upcomingEvents}
          onRSVP={onRSVP}
          onCancelRSVP={onCancelRSVP}
          onEventSelect={handleEventSelect}
          selectedEventId={selectedEventId}
        />
      </ErrorBoundary>

      {pastEvents.length > 0 && (
        <div className="border-t p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <CalendarFold className="h-6 w-6" />
            Past Events
          </h2>
          <ErrorBoundary fallback={<div>Error loading past events. Please try again later.</div>}>
            <EventList 
              events={pastEvents}
              onRSVP={onRSVP}
              onCancelRSVP={onCancelRSVP}
              onEventSelect={handleEventSelect}
              selectedEventId={selectedEventId}
            />
          </ErrorBoundary>
        </div>
      )}
    </>
  );
}
import { Event } from "@/types/event";
import { EventList } from "@/components/event/EventList";
import { LazyMap } from "@/components/event/map/LazyMap";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { CalendarFold } from "lucide-react";
import { useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";

interface EventsContentProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
  onRSVP: (eventId: string, guests?: { firstName: string }[]) => Promise<void>;
  onCancelRSVP: (eventId: string) => Promise<void>;
  isLoading?: boolean;
}

export function EventsContent({
  upcomingEvents,
  pastEvents,
  onRSVP,
  onCancelRSVP,
  isLoading = false,
}: EventsContentProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const { profile, isAuthenticated } = useAuthState();

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId === selectedEventId ? null : eventId);
  };

  const canViewMap = isAuthenticated && profile?.is_approved;

  return (
    <>
      {upcomingEvents.length > 0 && canViewMap && (
        <div className="mb-8">
          <ErrorBoundary fallback={<div>Error loading map. Please try again later.</div>}>
            <LazyMap 
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
          isLoading={isLoading}
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
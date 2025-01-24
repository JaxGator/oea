import { Event } from "@/types/event";
import { EventCard } from "@/components/EventCard";

interface EventListProps {
  events: Event[];
  onRSVP: (eventId: string, guests?: { firstName: string }[]) => Promise<void>;
  onCancelRSVP: (eventId: string) => Promise<void>;
  onEventSelect?: (eventId: string) => void;
  selectedEventId?: string | null;
}

export function EventList({ 
  events = [], 
  onRSVP, 
  onCancelRSVP,
  onEventSelect,
  selectedEventId 
}: EventListProps) {
  if (!Array.isArray(events)) {
    console.error("Events is not an array:", events);
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Error loading events. Please try again.</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No events found for the selected date.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => {
        const userRSVP = event.rsvps?.find(
          rsvp => rsvp.user_id === event.created_by
        );
        
        return (
          <EventCard
            key={event.id}
            event={event}
            onRSVP={onRSVP}
            onCancelRSVP={() => onCancelRSVP(event.id)}
            userRSVPStatus={userRSVP?.response || null}
            onSelect={() => onEventSelect?.(event.id)}
            isSelected={event.id === selectedEventId}
          />
        );
      })}
    </div>
  );
}
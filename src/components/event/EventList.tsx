import { Event } from "@/types/event";
import { EventCard } from "@/components/EventCard";
import { useRSVPManagement } from "@/hooks/events/useRSVPManagement";

interface EventListProps {
  events: Event[];
  onRSVP: (eventId: string, guests?: { firstName: string }[]) => Promise<void>;
  onCancelRSVP: (eventId: string) => Promise<void>;
}

export function EventList({ events, onRSVP, onCancelRSVP }: EventListProps) {
  const { userRSVPs } = useRSVPManagement();

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No events found for the selected date.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onRSVP={(guests) => onRSVP(event.id, guests)}
          onCancelRSVP={() => onCancelRSVP(event.id)}
          userRSVPStatus={userRSVPs[event.id]}
        />
      ))}
    </div>
  );
}
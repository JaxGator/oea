import { Event } from "@/types/event";
import { EventCard } from "@/components/EventCard";
import { useAuthState } from "@/hooks/useAuthState";
import { Skeleton } from "@/components/ui/skeleton";

interface EventListProps {
  events: Event[];
  onRSVP: (eventId: string, guests?: { firstName: string }[]) => Promise<void>;
  onCancelRSVP: (eventId: string) => Promise<void>;
  onEventSelect?: (eventId: string) => void;
  selectedEventId?: string | null;
  isLoading?: boolean;
}

export function EventList({ 
  events = [], 
  onRSVP, 
  onCancelRSVP,
  onEventSelect,
  selectedEventId,
  isLoading = false
}: EventListProps) {
  const { isLoading: isAuthChecking } = useAuthState();

  if (!Array.isArray(events)) {
    console.error("Events is not an array:", events);
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Error loading events. Please try again.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
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
            isAuthChecking={isAuthChecking}
            requireAuth={true}
          />
        );
      })}
    </div>
  );
}
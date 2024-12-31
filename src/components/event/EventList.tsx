import { Event } from "@/types/event";
import { EventCard } from "@/components/EventCard";
import { useRSVPManagement } from "@/hooks/events/useRSVPManagement";
import { Skeleton } from "@/components/ui/skeleton";

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
        <div key={event.id} className="opacity-0 animate-fade-in">
          <EventCard
            event={event}
            onRSVP={onRSVP}
            onCancelRSVP={() => onCancelRSVP(event.id)}
            userRSVPStatus={userRSVPs[event.id]}
          />
        </div>
      ))}
    </div>
  );
}

// Add a loading skeleton component for better perceived performance
export function EventListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-full">
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}
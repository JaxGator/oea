
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
  onUpdate?: () => void;
  userRSVPs?: Record<string, string>;
  isAuthenticated: boolean;
}

export function EventList({ 
  events = [], 
  onRSVP, 
  onCancelRSVP,
  onEventSelect,
  selectedEventId,
  isLoading = false,
  onUpdate,
  userRSVPs = {},
  isAuthenticated
}: EventListProps) {
  const { isLoading: isAuthChecking } = useAuthState();

  // Show better loading state skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!Array.isArray(events)) {
    console.error("Events is not an array:", events);
    return (
      <div className="text-center py-8 rounded-lg bg-white shadow p-6">
        <p className="text-gray-500">Error loading events. Please try again.</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow p-6 animate-fade-in">
        <p className="text-gray-500">No events found for the selected date.</p>
        <p className="text-gray-400 mt-2">Try selecting a different date or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
      {events.map((event) => (
        <div key={event.id} className="h-full w-full">
          <EventCard
            event={event}
            onRSVP={onRSVP}
            onCancelRSVP={() => onCancelRSVP(event.id)}
            userRSVPStatus={userRSVPs[event.id]}
            onSelect={() => {
              console.log('EventList - Card clicked:', event.id);
              onEventSelect?.(event.id);
            }}
            isSelected={event.id === selectedEventId}
            isAuthChecking={isAuthChecking}
            requireAuth={true}
            onUpdate={onUpdate}
            isAuthenticated={isAuthenticated}
          />
        </div>
      ))}
    </div>
  );
}

function EventCardSkeleton() {
  return (
    <div className="h-[450px] rounded-lg overflow-hidden border border-gray-200 bg-white shadow animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
        <div className="flex flex-col gap-2 mt-8">
          <div className="h-10 bg-gray-200 rounded w-full" />
          <div className="h-10 bg-gray-200 rounded w-full opacity-60" />
        </div>
      </div>
    </div>
  );
}

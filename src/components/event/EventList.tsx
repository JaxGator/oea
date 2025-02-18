
import { Event } from "@/types/event";
import { EventCard } from "@/components/EventCard";
import { useAuthState } from "@/hooks/useAuthState";
import { Skeleton } from "@/components/ui/skeleton";
import { useEventWithRSVPs } from "@/hooks/events/useEventWithRSVPs";

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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="relative h-[400px] rounded-lg overflow-hidden border border-gray-200 animate-pulse">
            <div className="h-48 bg-gray-100" />
            <div className="p-4 space-y-4">
              <div className="h-6 bg-gray-100 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-100 rounded w-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <p className="text-gray-500">No events found for the selected date.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
      {events.map((event) => {
        const userRSVPStatus = userRSVPs[event.id];
        
        // Fetch full event data with RSVPs
        const { data: fullEventData } = useEventWithRSVPs(event.id);
        const eventWithRSVPs = fullEventData || event;
        
        console.log('EventList - Full event data:', eventWithRSVPs);
        
        return (
          <div key={event.id} className="w-full">
            <EventCard
              event={eventWithRSVPs}
              onRSVP={onRSVP}
              onCancelRSVP={() => onCancelRSVP(event.id)}
              userRSVPStatus={userRSVPStatus}
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
        );
      })}
    </div>
  );
}

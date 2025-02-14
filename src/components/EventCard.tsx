
import { Event } from "@/types/event";
import { EventCardContainer } from "./event/EventCardContainer";
import { useAuthState } from "@/hooks/useAuthState";
import { useEventWithRSVPs } from "@/hooks/events/useEventWithRSVPs";

interface EventCardProps {
  event: Event;
  onRSVP: (eventId: string, guests?: { firstName: string }[]) => void;
  onCancelRSVP: (eventId: string) => void;
  userRSVPStatus?: string | null;
  onSelect?: () => void;
  isSelected?: boolean;
  onUpdate?: () => void;
  isAuthChecking?: boolean;
  requireAuth?: boolean;
}

export function EventCard({ 
  event,
  onRSVP,
  onCancelRSVP,
  userRSVPStatus = null,
  onSelect,
  isSelected = false,
  onUpdate,
  isAuthChecking = false,
  requireAuth = false
}: EventCardProps) {
  const { isAuthenticated } = useAuthState();
  const { data: eventWithRSVPs } = useEventWithRSVPs(event.id);

  console.log('EventCard - RSVP data:', eventWithRSVPs?.rsvps);

  if (!event) {
    console.error("Event object is undefined");
    return null;
  }

  // Merge the original event data with any updated RSVP data
  const enrichedEvent = {
    ...event,
    rsvps: eventWithRSVPs?.rsvps || event.rsvps || [],
    attendees: eventWithRSVPs?.attendees || event.attendees || []
  };

  return (
    <div className="h-full">
      <EventCardContainer 
        event={enrichedEvent}
        onRSVP={onRSVP}
        onCancelRSVP={onCancelRSVP}
        userRSVPStatus={userRSVPStatus}
        onSelect={onSelect}
        isSelected={isSelected}
        onUpdate={onUpdate}
        isAuthChecking={isAuthChecking}
        requireAuth={requireAuth}
        showDelete={true}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}

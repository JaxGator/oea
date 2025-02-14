
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
  const { data: eventWithRSVPs, isLoading, error } = useEventWithRSVPs(event?.id);

  console.log('EventCard - Event data:', {
    originalEvent: event,
    enrichedEvent: eventWithRSVPs,
    loading: isLoading,
    error: error
  });

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

  console.log('EventCard - Final enriched event:', {
    id: enrichedEvent.id,
    title: enrichedEvent.title,
    rsvpCount: enrichedEvent.rsvps?.length,
    attendeeCount: enrichedEvent.attendees?.length,
    attendees: enrichedEvent.attendees
  });

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

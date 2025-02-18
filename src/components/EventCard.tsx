
import { Event } from "@/types/event";
import { EventCardContainer } from "./event/EventCardContainer";
import { useAuthState } from "@/hooks/useAuthState";

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
  isAuthenticated?: boolean;
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
  requireAuth = false,
  isAuthenticated = false
}: EventCardProps) {
  console.log('EventCard - Event data:', event);
  console.log('EventCard - RSVPs:', event.rsvps);

  // Process attendees from RSVPs
  const processedAttendees = event.rsvps
    ?.filter(rsvp => rsvp.response === 'attending' && rsvp.status === 'confirmed')
    .map(rsvp => ({
      name: rsvp.profiles?.username || 'Unknown',
      guests: rsvp.event_guests?.map(guest => guest.first_name) || []
    }));

  console.log('EventCard - Processed attendees:', processedAttendees);

  const attendeeNames = processedAttendees
    ?.flatMap(({name, guests}) => [
      name,
      ...guests.map(guestName => `${guestName} (Guest of ${name})`)
    ]) || [];

  console.log('EventCard - Final attendee names:', attendeeNames);

  if (!event) {
    console.error("Event object is undefined");
    return null;
  }

  const eventWithAttendees: Event = {
    ...event,
    time: event.time || '00:00:00', // Ensure time is always provided
    attendeeCount: processedAttendees?.length || 0,
    attendeeNames
  };

  return (
    <div className="h-full">
      <EventCardContainer 
        event={eventWithAttendees}
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

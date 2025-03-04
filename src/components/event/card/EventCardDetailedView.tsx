
import { Event } from "@/types/event";
import { EventDetailedHeader } from "./sections/detailed/EventDetailedHeader";
import { EventDetailedContent } from "./sections/detailed/EventDetailedContent";

interface EventCardDetailedViewProps {
  event: Event;
  rsvpCount: number;
  attendeeNames: string[];
  userRSVPStatus: string | null;
  isAdmin: boolean;
  canManageEvents: boolean;
  isPastEvent: boolean;
  isWixEvent: boolean;
  canAddGuests: boolean;
  currentGuests?: { firstName: string }[];
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublish?: () => void;
  isAuthenticated?: boolean;
}

export function EventCardDetailedView({
  event,
  rsvpCount,
  attendeeNames,
  userRSVPStatus,
  isAdmin,
  canManageEvents,
  isPastEvent,
  isWixEvent,
  canAddGuests,
  currentGuests = [],
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  onTogglePublish,
  isAuthenticated = false,
}: EventCardDetailedViewProps) {
  const isFullyBooked = rsvpCount >= event.max_guests;
  const canJoinWaitlist = event.waitlist_enabled && isFullyBooked;
  const canViewRSVPs = true; // Allow all users to view RSVPs

  // Process attendee names from RSVPs and their guests
  const processedAttendeeNames = event.rsvps
    ?.filter(rsvp => rsvp.response === 'attending' && rsvp.status === 'confirmed')
    .flatMap(rsvp => {
      const names = [];
      // Add the main RSVP holder
      if (rsvp.profiles?.username) {
        names.push(rsvp.profiles.username);
      }
      // Add their guests if any
      if (rsvp.event_guests && rsvp.event_guests.length > 0) {
        names.push(...rsvp.event_guests.map(guest => 
          `${guest.first_name} (Guest of ${rsvp.profiles?.username || 'Unknown'})`
        ));
      }
      return names;
    }) || [];

  // Process waitlist names
  const waitlistNames = event.rsvps
    ?.filter(rsvp => rsvp.status === 'waitlisted')
    .map(rsvp => rsvp.profiles?.username)
    .filter(name => name) || [];

  console.log('EventCardDetailedView - Attendees:', { 
    processedAttendeeNames,
    rsvpCount,
    userRSVPStatus,
    canViewRSVPs,
    event
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <EventDetailedHeader event={event} />
      
      <EventDetailedContent
        event={event}
        processedAttendeeNames={processedAttendeeNames}
        waitlistNames={waitlistNames}
        rsvpCount={rsvpCount}
        userRSVPStatus={userRSVPStatus}
        isAdmin={isAdmin}
        canManageEvents={canManageEvents}
        isPastEvent={isPastEvent}
        isWixEvent={isWixEvent}
        canAddGuests={canAddGuests}
        currentGuests={currentGuests}
        canViewRSVPs={canViewRSVPs}
        isFullyBooked={isFullyBooked}
        canJoinWaitlist={canJoinWaitlist}
        onRSVP={onRSVP}
        onCancelRSVP={onCancelRSVP}
        onEdit={onEdit}
        onDelete={onDelete}
        onTogglePublish={onTogglePublish}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}

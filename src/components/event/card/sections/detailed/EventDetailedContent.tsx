
import { EventDetails } from "@/components/event/EventDetails";
import { Event } from "@/types/event";
import { EventDetailedInfo } from "./EventDetailedInfo";
import { EventDetailedAttendees } from "./EventDetailedAttendees";
import { EventDetailedDescription } from "./EventDetailedDescription";
import { EventDetailedActions } from "./EventDetailedActions";
import { EventDetailedWaitlist } from "./EventDetailedWaitlist";

interface EventDetailedContentProps {
  event: Event;
  processedAttendeeNames: string[];
  waitlistNames: string[];
  rsvpCount: number;
  userRSVPStatus: string | null;
  isAdmin: boolean;
  canManageEvents: boolean;
  isPastEvent: boolean;
  isWixEvent: boolean;
  canAddGuests: boolean;
  currentGuests: { firstName: string }[];
  canViewRSVPs: boolean;
  isFullyBooked: boolean;
  canJoinWaitlist: boolean;
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublish?: () => void;
  isAuthenticated?: boolean;
}

export function EventDetailedContent({
  event,
  processedAttendeeNames,
  waitlistNames,
  rsvpCount,
  userRSVPStatus,
  isAdmin,
  canManageEvents,
  isPastEvent,
  isWixEvent,
  canAddGuests,
  currentGuests,
  isFullyBooked,
  canJoinWaitlist,
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  onTogglePublish,
  isAuthenticated = false,
}: EventDetailedContentProps) {
  return (
    <div className="px-6 space-y-6">
      <EventDetailedInfo 
        event={event} 
        rsvpCount={rsvpCount} 
        isPastEvent={isPastEvent} 
        isWixEvent={isWixEvent} 
      />
      
      <EventDetails event={event} />
      
      <EventDetailedAttendees
        attendeeNames={processedAttendeeNames}
        waitlistNames={waitlistNames}
      />
      
      <EventDetailedDescription description={event.description} />
      
      {isAuthenticated && (
        <EventDetailedActions
          isAdmin={isAdmin}
          canManageEvents={canManageEvents}
          userRSVPStatus={userRSVPStatus}
          isPastEvent={isPastEvent}
          canAddGuests={canAddGuests}
          currentGuests={currentGuests}
          onRSVP={onRSVP}
          onCancelRSVP={onCancelRSVP}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePublish={onTogglePublish}
          isFullyBooked={isFullyBooked}
          canJoinWaitlist={canJoinWaitlist}
          isWixEvent={isWixEvent}
          event={event}
          isAuthenticated={isAuthenticated}
        />
      )}
      
      <EventDetailedWaitlist
        waitlistEnabled={event.waitlist_enabled}
        waitlistCount={waitlistNames.length}
        waitlistCapacity={event.waitlist_capacity}
      />
    </div>
  );
}

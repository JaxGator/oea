import { Event } from "@/types/event";
import { EventCardBasicInfo } from "./EventCardBasicInfo";
import { WaitlistInfo } from "./WaitlistInfo";
import { AttendeeList } from "../details/AttendeeList";
import { EventImageSection } from "./sections/EventImageSection";
import { EventDetailsSection } from "./sections/EventDetailsSection";
import { EventActionsSection } from "./sections/EventActionsSection";

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
}: EventCardDetailedViewProps) {
  const isFullyBooked = rsvpCount >= event.max_guests;
  const canJoinWaitlist = event.waitlist_enabled && isFullyBooked;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <EventImageSection imageUrl={event.image_url} title={event.title} />

      <div className="px-6 space-y-6">
        <EventCardBasicInfo
          date={event.date}
          location={event.location}
          rsvpCount={rsvpCount}
          maxGuests={event.max_guests}
          isWixEvent={isWixEvent}
          waitlistEnabled={event.waitlist_enabled}
          waitlistCapacity={event.waitlist_capacity}
          importedRsvpCount={event.imported_rsvp_count}
          isPastEvent={isPastEvent}
        />
        
        <EventDetailsSection
          event={event}
          rsvpCount={rsvpCount}
          maxGuests={event.max_guests}
          attendeeNames={attendeeNames}
          isPastEvent={isPastEvent}
        />

        <AttendeeList
          attendeeNames={attendeeNames}
        />

        {event.description && (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: event.description }} />
          </div>
        )}

        <EventActionsSection
          isAdmin={isAdmin}
          canManageEvents={canManageEvents}
          userRSVPStatus={userRSVPStatus}
          isFullyBooked={isFullyBooked}
          canJoinWaitlist={canJoinWaitlist}
          onRSVP={onRSVP}
          onCancelRSVP={onCancelRSVP}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePublish={() => {}}
          isPastEvent={isPastEvent}
          isWixEvent={isWixEvent}
          isPublished={event.is_published ?? true}
          canAddGuests={canAddGuests}
          currentGuests={currentGuests}
        />

        {event.waitlist_enabled && (
          <WaitlistInfo
            waitlistEnabled={event.waitlist_enabled}
            waitlistCount={0}
            waitlistCapacity={event.waitlist_capacity}
          />
        )}
      </div>
    </div>
  );
}
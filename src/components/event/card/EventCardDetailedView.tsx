
import { Event } from "@/types/event";
import { EventCardBasicInfo } from "./EventCardBasicInfo";
import { WaitlistInfo } from "./WaitlistInfo";
import { AttendeeList } from "../details/AttendeeList";
import { EventImageSection } from "./sections/EventImageSection";
import { EventActionsSection } from "./sections/EventActionsSection";
import { EventDetails } from "../EventDetails";

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
}: EventCardDetailedViewProps) {
  const isFullyBooked = rsvpCount >= event.max_guests;
  const canJoinWaitlist = event.waitlist_enabled && isFullyBooked;
  const canViewRSVPs = isAdmin || canManageEvents || userRSVPStatus === "attending";

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <EventImageSection imageUrl={event.image_url} title={event.title} />

      <div className="px-6 space-y-6">
        {/* Summary information - date, time, and RSVP counts */}
        <EventCardBasicInfo
          date={event.date}
          time={event.time || '00:00:00'}
          rsvpCount={rsvpCount}
          maxGuests={event.max_guests}
          isWixEvent={isWixEvent}
          waitlistEnabled={event.waitlist_enabled}
          waitlistCapacity={event.waitlist_capacity}
          importedRsvpCount={event.imported_rsvp_count}
          isPastEvent={isPastEvent}
        />
        
        {/* Location with map */}
        <EventDetails event={event} />

        {/* Attendee list - only shown when user has permission */}
        {canViewRSVPs && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Event Attendees</h3>
            <AttendeeList
              attendeeNames={attendeeNames}
            />
          </div>
        )}

        {/* Event description */}
        {event.description && (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: event.description }} />
          </div>
        )}

        {/* Action buttons */}
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
          onTogglePublish={onTogglePublish}
          isPastEvent={isPastEvent}
          isWixEvent={isWixEvent}
          isPublished={event.is_published}
          showPublishToggle={true}
          canAddGuests={canAddGuests}
          currentGuests={currentGuests}
          event={{ id: event.id, title: event.title }}
        />

        {/* Waitlist information if enabled */}
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

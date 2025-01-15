import { Event } from "@/types/event";
import { EventActions } from "../actions/EventActions";
import { EventCardBasicInfo } from "./EventCardBasicInfo";
import { EventMetadata } from "./EventMetadata";
import { WaitlistInfo } from "./WaitlistInfo";
import { FeaturedEventBadge } from "./FeaturedEventBadge";

interface EventCardContentProps {
  event: Event;
  rsvpCount: number;
  isAdmin: boolean;
  canManageEvents: boolean;
  userRSVPStatus: string | null;
  isPastEvent: boolean;
  canAddGuests: boolean;
  waitlistEnabled?: boolean;
  waitlistCount?: number;
  waitlistCapacity?: number | null;
  currentGuests?: { firstName: string }[];
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showPublishToggle?: boolean;
  isPublished?: boolean;
  onViewDetails?: () => void;
  onTogglePublish?: () => void;
}

export function EventCardContent({
  event,
  rsvpCount,
  isAdmin,
  canManageEvents,
  userRSVPStatus,
  isPastEvent,
  canAddGuests,
  waitlistEnabled,
  waitlistCount = 0,
  waitlistCapacity,
  currentGuests = [],
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  showPublishToggle,
  isPublished = true,
  onViewDetails,
  onTogglePublish,
}: EventCardContentProps) {
  const isFullyBooked = rsvpCount >= event.max_guests;
  const canJoinWaitlist = waitlistEnabled && 
    (!waitlistCapacity || waitlistCount < waitlistCapacity);

  return (
    <div className="p-4 space-y-4">
      {event.is_featured && <FeaturedEventBadge />}
      
      <EventCardBasicInfo
        date={event.date}
        location={event.location}
        rsvpCount={rsvpCount}
        maxGuests={event.max_guests}
        isWixEvent={!!event.imported_rsvp_count}
        waitlistEnabled={event.waitlist_enabled}
        waitlistCapacity={event.waitlist_capacity}
        importedRsvpCount={event.imported_rsvp_count}
        isPastEvent={isPastEvent}
      />
      
      <EventMetadata
        maxGuests={event.max_guests}
        rsvpCount={rsvpCount}
        isPublished={isPublished}
        isPastEvent={isPastEvent}
      />

      {waitlistEnabled && (
        <WaitlistInfo
          waitlistCount={waitlistCount}
          waitlistCapacity={waitlistCapacity}
        />
      )}

      <EventActions
        isAdmin={isAdmin}
        canManageEvents={canManageEvents}
        userRSVPStatus={userRSVPStatus}
        isFullyBooked={isFullyBooked}
        canJoinWaitlist={canJoinWaitlist}
        onRSVP={onRSVP}
        onCancelRSVP={onCancelRSVP}
        onEdit={onEdit}
        onDelete={onDelete}
        isPastEvent={isPastEvent}
        isWixEvent={!!event.imported_rsvp_count}
        canAddGuests={canAddGuests}
        currentGuests={currentGuests}
        showPublishToggle={showPublishToggle}
        isPublished={isPublished}
        onTogglePublish={onTogglePublish}
      />
    </div>
  );
}
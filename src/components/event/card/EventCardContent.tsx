import { Event } from "@/types/event";
import { EventCardBasicInfo } from "./EventCardBasicInfo";
import { EventCardActions } from "./EventCardActions";

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
  currentGuests: { firstName: string }[];
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showPublishToggle?: boolean;
  isPublished?: boolean;
  onViewDetails: () => void;
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
  waitlistCount,
  waitlistCapacity,
  currentGuests,
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  showPublishToggle = false,
  isPublished = true,
  onViewDetails,
  onTogglePublish,
}: EventCardContentProps) {
  return (
    <div className="p-4">
      <EventCardBasicInfo
        date={event.date}
        location={event.location}
        rsvpCount={rsvpCount}
        maxGuests={event.max_guests}
        isPastEvent={isPastEvent}
        canViewDetails={isAdmin || canManageEvents || isPublished}
        waitlistEnabled={waitlistEnabled}
        waitlistCapacity={waitlistCapacity}
        isWixEvent={!!event.imported_rsvp_count}
        importedRsvpCount={event.imported_rsvp_count}
      />

      <EventCardActions
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
        showPublishToggle={showPublishToggle}
        isPublished={isPublished}
        onViewDetails={onViewDetails}
        onTogglePublish={onTogglePublish}
      />
    </div>
  );
}
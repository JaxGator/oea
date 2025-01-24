import { Event } from "@/types/event";
import { EventCardBasicInfo } from "./EventCardBasicInfo";
import { EventCardActions } from "./EventCardActions";
import { EventAdminEdit } from "./EventAdminEdit";

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
  editedRSVPCount: string;
  isEditingRSVP: boolean;
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showPublishToggle?: boolean;
  isPublished?: boolean;
  onViewDetails: () => void;
  onTogglePublish?: () => void;
  onEditRSVP: () => void;
  onSaveRSVP: () => void;
  onCancelEdit: () => void;
  onRSVPCountChange: (value: string) => void;
  isAuthChecking?: boolean;
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
  editedRSVPCount,
  isEditingRSVP,
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  showPublishToggle = false,
  isPublished = true,
  onViewDetails,
  onTogglePublish,
  onEditRSVP,
  onSaveRSVP,
  onCancelEdit,
  onRSVPCountChange,
  isAuthChecking = false
}: EventCardContentProps) {
  return (
    <div className="p-4">
      <EventCardBasicInfo
        date={event.date}
        location={event.location}
        rsvpCount={rsvpCount}
        maxGuests={event.max_guests}
        isPastEvent={isPastEvent}
        canViewDetails={isAdmin || canManageEvents || (isPublished && userRSVPStatus === "attending")}
        waitlistEnabled={waitlistEnabled}
        waitlistCapacity={waitlistCapacity}
        isWixEvent={!!event.imported_rsvp_count}
        importedRsvpCount={event.imported_rsvp_count}
      />

      {(isAdmin || canManageEvents) && isPastEvent && (
        <EventAdminEdit
          isAdmin={isAdmin}
          isPastEvent={isPastEvent}
          editedRSVPCount={editedRSVPCount}
          onEditRSVP={onEditRSVP}
          onSaveRSVP={onSaveRSVP}
          onCancelEdit={onCancelEdit}
          onRSVPCountChange={onRSVPCountChange}
          isEditingRSVP={isEditingRSVP}
        />
      )}

      <div className="mt-4">
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
          showDelete={true}
          showPublishToggle={showPublishToggle}
          isPublished={isPublished}
          onViewDetails={onViewDetails}
          onTogglePublish={onTogglePublish}
          isAuthChecking={isAuthChecking}
        />
      </div>
    </div>
  );
}
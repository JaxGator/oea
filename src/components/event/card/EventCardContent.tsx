
import { Event } from "@/types/event";
import { EventDetailsSection } from "./sections/EventDetailsSection";
import { EventActionsSection } from "./sections/EventActionsSection";

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
  requireAuth?: boolean;
  showDelete?: boolean;
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
  isAuthChecking = false,
  requireAuth = false,
  showDelete = false
}: EventCardContentProps) {
  return (
    <div className="p-4">
      <EventDetailsSection
        event={event}
        rsvpCount={rsvpCount}
        isAdmin={isAdmin}
        canManageEvents={canManageEvents}
        isPastEvent={isPastEvent}
        waitlistEnabled={waitlistEnabled}
        waitlistCapacity={waitlistCapacity}
        editedRSVPCount={editedRSVPCount}
        isEditingRSVP={isEditingRSVP}
        onEditRSVP={onEditRSVP}
        onSaveRSVP={onSaveRSVP}
        onCancelEdit={onCancelEdit}
        onRSVPCountChange={onRSVPCountChange}
      />

      <EventActionsSection
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
        isAuthChecking={isAuthChecking}
        requireAuth={requireAuth}
        event={event}
        showDelete={showDelete}
      />
    </div>
  );
}

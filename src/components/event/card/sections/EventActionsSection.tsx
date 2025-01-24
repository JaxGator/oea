import { EventCardActions } from "../EventCardActions";

interface EventActionsSectionProps {
  isAdmin: boolean;
  canManageEvents: boolean;
  userRSVPStatus: string | null;
  isPastEvent: boolean;
  canAddGuests: boolean;
  currentGuests: { firstName: string }[];
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showDelete?: boolean;
  showPublishToggle?: boolean;
  isPublished?: boolean;
  onViewDetails: () => void;
  onTogglePublish: () => void;
  isAuthChecking?: boolean;
}

export function EventActionsSection({
  isAdmin,
  canManageEvents,
  userRSVPStatus,
  isPastEvent,
  canAddGuests,
  currentGuests,
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  showDelete = true,
  showPublishToggle = false,
  isPublished = true,
  onViewDetails,
  onTogglePublish,
  isAuthChecking = false
}: EventActionsSectionProps) {
  return (
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
        showDelete={showDelete}
        showPublishToggle={showPublishToggle}
        isPublished={isPublished}
        onViewDetails={onViewDetails}
        onTogglePublish={onTogglePublish}
        isAuthChecking={isAuthChecking}
      />
    </div>
  );
}
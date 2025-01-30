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
  showPublishToggle?: boolean;
  isPublished?: boolean;
  onViewDetails: () => void;
  onTogglePublish?: () => void;
  isAuthChecking?: boolean;
  isFullyBooked?: boolean;
  canJoinWaitlist?: boolean;
  isWixEvent?: boolean;
  requireAuth?: boolean;
  event: { id: string; title: string };
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
  showPublishToggle = false,
  isPublished = true,
  onViewDetails,
  onTogglePublish,
  isAuthChecking = false,
  isFullyBooked = false,
  canJoinWaitlist = false,
  isWixEvent = false,
  requireAuth = false,
  event
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
        showPublishToggle={showPublishToggle}
        isPublished={isPublished}
        onViewDetails={onViewDetails}
        onTogglePublish={onTogglePublish}
        isAuthChecking={isAuthChecking}
        isFullyBooked={isFullyBooked}
        canJoinWaitlist={canJoinWaitlist}
        isWixEvent={isWixEvent}
        requireAuth={requireAuth}
        event={event}
      />
    </div>
  );
}
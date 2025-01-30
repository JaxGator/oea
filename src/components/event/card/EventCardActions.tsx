import { EventActions } from "../actions/EventActions";

interface EventCardActionsProps {
  isAdmin: boolean;
  canManageEvents: boolean;
  userRSVPStatus: string | null;
  isPastEvent: boolean;
  canAddGuests: boolean;
  currentGuests?: { firstName: string }[];
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isPublished?: boolean;
  showPublishToggle?: boolean;
  showDelete?: boolean;
  onViewDetails: () => void;
  onTogglePublish: () => void;
  isAuthChecking?: boolean;
  isFullyBooked?: boolean;
  canJoinWaitlist?: boolean;
  isWixEvent?: boolean;
  requireAuth?: boolean;
  event: { id: string; title: string };
}

export function EventCardActions({
  isAdmin,
  canManageEvents,
  userRSVPStatus,
  isPastEvent,
  canAddGuests,
  currentGuests = [],
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  isPublished = true,
  showPublishToggle = false,
  showDelete = false,
  onViewDetails,
  onTogglePublish,
  isAuthChecking = false,
  isFullyBooked = false,
  canJoinWaitlist = false,
  isWixEvent = false,
  requireAuth = false,
  event
}: EventCardActionsProps) {
  if (isAuthChecking) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  return (
    <EventActions
      isAdmin={isAdmin}
      canManageEvents={canManageEvents}
      userRSVPStatus={userRSVPStatus}
      isFullyBooked={isFullyBooked}
      onRSVP={onRSVP}
      onCancelRSVP={onCancelRSVP}
      onEdit={onEdit}
      onDelete={onDelete}
      isPastEvent={isPastEvent}
      isWixEvent={isWixEvent}
      canAddGuests={canAddGuests}
      currentGuests={currentGuests}
      onViewDetails={onViewDetails}
      onTogglePublish={onTogglePublish}
      isPublished={isPublished}
      showPublishToggle={showPublishToggle}
      showDelete={showDelete}
      canJoinWaitlist={canJoinWaitlist}
      requireAuth={requireAuth}
      event={event}
    />
  );
}
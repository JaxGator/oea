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
  showPublishToggle?: boolean;
  isPublished?: boolean;
  onViewDetails: () => void;
  onTogglePublish?: () => void;
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
  showPublishToggle = false,
  isPublished = true,
  onViewDetails,
  onTogglePublish,
}: EventCardActionsProps) {
  const isFullyBooked = false; // This should be calculated based on event data
  const canJoinWaitlist = false; // This should be calculated based on event data
  const isWixEvent = false; // This should be passed as a prop if needed

  return (
    <EventActions
      isAdmin={isAdmin}
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
    />
  );
}
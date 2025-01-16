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
  onViewDetails: () => void;
  onTogglePublish: () => void;
  isFullyBooked?: boolean;
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
  onViewDetails,
  onTogglePublish,
  isFullyBooked = false,
}: EventCardActionsProps) {
  const isWixEvent = false; // This should be passed as a prop if needed

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
    />
  );
}
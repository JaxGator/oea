import { EventActions } from "../actions/EventActions";

interface EventCardActionsProps {
  isAdmin: boolean;
  userRSVPStatus: string | null;
  isFullyBooked: boolean;
  canJoinWaitlist: boolean;
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isPastEvent: boolean;
  isWixEvent: boolean;
  canAddGuests: boolean;
  currentGuests?: { firstName: string }[];
}

export function EventCardActions({
  isAdmin,
  userRSVPStatus,
  isFullyBooked,
  canJoinWaitlist,
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  isPastEvent,
  isWixEvent,
  canAddGuests,
  currentGuests = [],
}: EventCardActionsProps) {
  return (
    <EventActions
      isAdmin={isAdmin}
      userRSVPStatus={userRSVPStatus}
      isFullyBooked={isFullyBooked}
      canJoinWaitlist={canJoinWaitlist}
      onRSVP={onRSVP}
      onCancelRSVP={onCancelRSVP}
      onEdit={onEdit}
      onDelete={onDelete}
      isPastEvent={isPastEvent}
      isWixEvent={isWixEvent}
      showDelete={isAdmin && (isPastEvent || isWixEvent)}
      canAddGuests={canAddGuests}
      currentGuests={currentGuests}
    />
  );
}
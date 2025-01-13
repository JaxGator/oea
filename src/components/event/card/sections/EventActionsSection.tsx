import { EventActions } from "../../actions/EventActions";

interface EventActionsSectionProps {
  isAdmin: boolean;
  userRSVPStatus: string | null;
  isFullyBooked: boolean;
  canJoinWaitlist: boolean;
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublish?: () => void;
  isPastEvent: boolean;
  isWixEvent: boolean;
  isPublished: boolean;
  canAddGuests: boolean;
  currentGuests?: { firstName: string }[];
}

export function EventActionsSection({
  isAdmin,
  userRSVPStatus,
  isFullyBooked,
  canJoinWaitlist,
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  onTogglePublish,
  isPastEvent,
  isWixEvent,
  isPublished,
  canAddGuests,
  currentGuests = []
}: EventActionsSectionProps) {
  return (
    <div className="shadow-sm rounded-lg bg-white p-4">
      <EventActions
        isAdmin={isAdmin}
        userRSVPStatus={userRSVPStatus}
        isFullyBooked={isFullyBooked}
        canJoinWaitlist={canJoinWaitlist}
        onRSVP={onRSVP}
        onCancelRSVP={onCancelRSVP}
        onEdit={onEdit}
        onDelete={onDelete}
        onTogglePublish={onTogglePublish}
        isPastEvent={isPastEvent}
        isWixEvent={isWixEvent}
        isPublished={isPublished}
        canAddGuests={canAddGuests}
        currentGuests={currentGuests}
      />
    </div>
  );
}
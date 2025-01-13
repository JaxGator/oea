import { Button } from "@/components/ui/button";
import { RSVPButton } from "./RSVPButton";
import { AddGuestsButton } from "./AddGuestsButton";
import { AdminActions } from "./AdminActions";

interface Guest {
  firstName: string;
}

interface EventActionsProps {
  isAdmin: boolean;
  userRSVPStatus: string | null;
  isFullyBooked: boolean;
  onRSVP: (guests?: Guest[]) => void;
  onCancelRSVP: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublish?: () => void;
  isPastEvent?: boolean;
  isWixEvent?: boolean;
  isPublished?: boolean;
  showDelete?: boolean;
  canAddGuests?: boolean;
  currentGuests?: Guest[];
  canJoinWaitlist?: boolean;
}

export function EventActions({
  isAdmin,
  userRSVPStatus,
  isFullyBooked,
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  onTogglePublish,
  isPastEvent,
  isWixEvent,
  isPublished = true,
  showDelete,
  canAddGuests,
  currentGuests = [],
  canJoinWaitlist
}: EventActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {!userRSVPStatus && !isPastEvent && isPublished && (
        <RSVPButton 
          isFullyBooked={isFullyBooked} 
          onRSVP={onRSVP} 
          canJoinWaitlist={canJoinWaitlist}
        />
      )}

      {userRSVPStatus === "attending" && !isPastEvent && (
        <>
          <Button
            variant="destructive"
            onClick={onCancelRSVP}
          >
            Cancel RSVP
          </Button>
          {canAddGuests && (
            <AddGuestsButton 
              onAddGuests={(newGuests) => onRSVP(newGuests)}
              currentGuests={currentGuests}
            />
          )}
        </>
      )}

      {isAdmin && (
        <AdminActions
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePublish={onTogglePublish}
          showDelete={showDelete}
          isWixEvent={isWixEvent}
          isPublished={isPublished}
        />
      )}
    </div>
  );
}
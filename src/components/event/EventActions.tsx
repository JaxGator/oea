import { Button } from "@/components/ui/button";
import { RSVPButton } from "./actions/RSVPButton";
import { AddGuestsButton } from "./actions/AddGuestsButton";
import { AdminActions } from "./actions/AdminActions";

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
  isPastEvent?: boolean;
  isWixEvent?: boolean;
  showDelete?: boolean;
  canAddGuests?: boolean;
  currentGuests?: Guest[];
}

export function EventActions({
  isAdmin,
  userRSVPStatus,
  isFullyBooked,
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  isPastEvent,
  isWixEvent,
  showDelete,
  canAddGuests,
  currentGuests = []
}: EventActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {!userRSVPStatus && !isPastEvent && (
        <RSVPButton isFullyBooked={isFullyBooked} onRSVP={onRSVP} />
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
          showDelete={showDelete}
          isWixEvent={isWixEvent}
        />
      )}
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { RSVPButton } from "./RSVPButton";
import { AddGuestsButton } from "./AddGuestsButton";
import { AdminActions } from "./AdminActions";
import { Eye } from "lucide-react";

interface Guest {
  firstName: string;
}

interface EventActionsProps {
  isAdmin: boolean;
  canManageEvents?: boolean; // Added this prop
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
  onViewDetails?: () => void;
}

export function EventActions({
  isAdmin,
  canManageEvents,
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
  currentGuests = [],
  onViewDetails
}: EventActionsProps) {
  const showViewDetails = isAdmin || canManageEvents || userRSVPStatus === "attending";

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

      {showViewDetails && onViewDetails && (
        <Button
          variant="outline"
          onClick={onViewDetails}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
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
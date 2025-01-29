import { Button } from "@/components/ui/button";
import { RSVPButton } from "./RSVPButton";
import { AddGuestsButton } from "./AddGuestsButton";

interface Guest {
  firstName: string;
}

interface EventActionButtonsProps {
  userRSVPStatus: string | null;
  isPastEvent: boolean;
  isFullyBooked: boolean;
  canJoinWaitlist?: boolean;
  canAddGuests?: boolean;
  currentGuests?: Guest[];
  onRSVP: (guests?: Guest[]) => void;
  onCancelRSVP: () => void;
  onViewDetails?: () => void;
  showViewDetails?: boolean;
  requireAuth?: boolean;
}

export function EventActionButtons({
  userRSVPStatus,
  isPastEvent,
  isFullyBooked,
  canJoinWaitlist,
  canAddGuests,
  currentGuests = [],
  onRSVP,
  onCancelRSVP,
  onViewDetails,
  showViewDetails = false,
  requireAuth = false
}: EventActionButtonsProps) {
  return (
    <>
      {!userRSVPStatus && !isPastEvent && (
        <RSVPButton 
          isFullyBooked={isFullyBooked} 
          onRSVP={onRSVP} 
          canJoinWaitlist={canJoinWaitlist}
          requireAuth={requireAuth}
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

      {showViewDetails && onViewDetails && (
        <Button
          variant="outline"
          onClick={onViewDetails}
        >
          View Details
        </Button>
      )}
    </>
  );
}
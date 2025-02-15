
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
  isAuthenticated?: boolean;
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
  requireAuth = false,
  isAuthenticated = false
}: EventActionButtonsProps) {
  console.log('EventActionButtons render:', { 
    userRSVPStatus, 
    isPastEvent, 
    isAuthenticated,
    isFullyBooked 
  });

  return (
    <>
      {isAuthenticated && !userRSVPStatus && !isPastEvent && (
        <RSVPButton 
          isFullyBooked={isFullyBooked} 
          onRSVP={onRSVP} 
          canJoinWaitlist={canJoinWaitlist}
          requireAuth={requireAuth}
        />
      )}

      {isAuthenticated && userRSVPStatus === "attending" && !isPastEvent && (
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

      {isAuthenticated && showViewDetails && onViewDetails && (
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

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { RSVPButton } from "./RSVPButton";
import { AddGuestsButton } from "./AddGuestsButton";

interface EventActionButtonsProps {
  userRSVPStatus: string | null;
  isPastEvent: boolean;
  isFullyBooked: boolean;
  canJoinWaitlist?: boolean;
  canAddGuests?: boolean;
  currentGuests?: { firstName: string }[];
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onViewDetails?: () => void;
  showViewDetails?: boolean;
  isAuthChecking?: boolean;
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
  showViewDetails,
  isAuthChecking = false
}: EventActionButtonsProps) {
  if (isAuthChecking) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  return (
    <>
      {!userRSVPStatus && !isPastEvent && (
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

      {showViewDetails && onViewDetails && (
        <Button
          variant="outline"
          onClick={onViewDetails}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          Details
        </Button>
      )}
    </>
  );
}
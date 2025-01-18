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
  showViewDetails
}: EventActionButtonsProps) {
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
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import { RSVPButton } from "./RSVPButton";
import { AddGuestsButton } from "./AddGuestsButton";
import { toast } from "sonner";

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
  const handleCancelRSVP = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel your RSVP?");
    if (confirmCancel) {
      onCancelRSVP();
      toast.success("Your RSVP has been cancelled");
    }
  };

  if (isAuthChecking) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!userRSVPStatus && !isPastEvent && (
        <RSVPButton 
          isFullyBooked={isFullyBooked} 
          onRSVP={onRSVP}
          canJoinWaitlist={canJoinWaitlist}
        />
      )}

      {userRSVPStatus === "attending" && !isPastEvent && (
        <div className="flex items-center gap-2 animate-fade-in">
          <Button
            variant="destructive"
            onClick={handleCancelRSVP}
            className="group relative"
          >
            <span className="relative z-10">Cancel RSVP</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Button>
          {canAddGuests && (
            <AddGuestsButton 
              onAddGuests={(newGuests) => {
                onRSVP(newGuests);
                toast.success("Guests added successfully");
              }}
              currentGuests={currentGuests}
            />
          )}
          <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
            ✓ Confirmed
          </div>
        </div>
      )}

      {showViewDetails && onViewDetails && (
        <Button
          variant="outline"
          onClick={onViewDetails}
          className="gap-2 hover:bg-gray-50 transition-colors"
        >
          <Eye className="h-4 w-4" />
          Details
        </Button>
      )}
    </div>
  );
}
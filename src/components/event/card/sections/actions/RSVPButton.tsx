
import { LoadingButton } from "@/components/ui/loading-button";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface RSVPButtonProps {
  isFullyBooked: boolean;
  canJoinWaitlist: boolean;
  isSubmitting: boolean;
  onRSVP: () => void;
}

export function RSVPButton({
  isFullyBooked,
  canJoinWaitlist,
  isSubmitting,
  onRSVP
}: RSVPButtonProps) {
  if (isFullyBooked && !canJoinWaitlist) {
    return (
      <Button disabled className="flex items-center gap-2 opacity-70">
        <Calendar className="h-4 w-4" />
        Event Full
      </Button>
    );
  }
  
  return (
    <LoadingButton
      onClick={onRSVP}
      isLoading={isSubmitting}
      className="flex items-center gap-2"
    >
      <Calendar className="h-4 w-4" />
      {isFullyBooked && canJoinWaitlist ? "Join Waitlist" : "RSVP"}
    </LoadingButton>
  );
}

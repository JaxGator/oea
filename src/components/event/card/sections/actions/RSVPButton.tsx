
import { LoadingButton } from "@/components/ui/loading-button";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

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
  // Get permissions synchronously to avoid "permission required" messages
  const { getEffectivePermissions } = usePermissions();
  const { isAdmin, canManageEvents } = getEffectivePermissions();

  // If the event is full and no waitlist is available
  if (isFullyBooked && !canJoinWaitlist) {
    return (
      <Button disabled className="flex items-center gap-2 opacity-70">
        <Calendar className="h-4 w-4" />
        Event Full
      </Button>
    );
  }
  
  return (
    <Button
      onClick={onRSVP}
      disabled={isSubmitting}
      className="flex items-center gap-2"
    >
      <Calendar className="h-4 w-4" />
      {isFullyBooked && canJoinWaitlist ? "Join Waitlist" : "RSVP"}
      {isSubmitting && <span className="ml-2 animate-spin">⌛</span>}
    </Button>
  );
}

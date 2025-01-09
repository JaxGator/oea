import { Button } from "@/components/ui/button";
import { useAuthState } from "@/hooks/useAuthState";

interface RSVPButtonProps {
  isFullyBooked: boolean;
  onRSVP: () => void;
  canJoinWaitlist?: boolean;
}

export function RSVPButton({ isFullyBooked, onRSVP, canJoinWaitlist }: RSVPButtonProps) {
  const { isAuthenticated, profile } = useAuthState();

  if (!isAuthenticated || !profile?.is_approved) {
    return null;
  }

  if (isFullyBooked && !canJoinWaitlist) {
    return (
      <Button variant="secondary" disabled>
        Event Full
      </Button>
    );
  }

  return (
    <Button onClick={onRSVP}>
      {isFullyBooked && canJoinWaitlist ? "Join Waitlist" : "RSVP"}
    </Button>
  );
}
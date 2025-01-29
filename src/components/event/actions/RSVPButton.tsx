import { Button } from "@/components/ui/button";

interface RSVPButtonProps {
  isFullyBooked: boolean;
  onRSVP: (guests?: { firstName: string }[]) => void;
  canJoinWaitlist?: boolean;
  requireAuth?: boolean;
}

export function RSVPButton({ 
  isFullyBooked, 
  onRSVP, 
  canJoinWaitlist = false,
  requireAuth = false
}: RSVPButtonProps) {
  const handleClick = () => {
    onRSVP();
  };

  if (isFullyBooked && !canJoinWaitlist) {
    return (
      <Button disabled>
        Fully Booked
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleClick}
      variant={isFullyBooked ? "secondary" : "default"}
    >
      {isFullyBooked ? "Join Waitlist" : "RSVP"}
    </Button>
  );
}
import { Button } from "@/components/ui/button";
import { useAuthState } from "@/hooks/useAuthState";
import { Loader2 } from "lucide-react";

interface RSVPButtonProps {
  isFullyBooked: boolean;
  onRSVP: () => void;
  canJoinWaitlist?: boolean;
}

export function RSVPButton({ isFullyBooked, onRSVP, canJoinWaitlist }: RSVPButtonProps) {
  const { isAuthenticated, profile, isLoading } = useAuthState();

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="min-w-[100px]">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  if (!isAuthenticated || !profile?.is_approved) {
    return null;
  }

  if (isFullyBooked && !canJoinWaitlist) {
    return (
      <Button 
        variant="secondary" 
        disabled 
        className="bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-100"
      >
        Event Full
      </Button>
    );
  }

  return (
    <Button 
      onClick={onRSVP}
      className="relative group overflow-hidden transition-all duration-300"
    >
      <span className="relative z-10 flex items-center gap-2">
        {isFullyBooked && canJoinWaitlist ? (
          <>
            Join Waitlist
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              Available
            </span>
          </>
        ) : (
          "RSVP"
        )}
      </span>
      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
    </Button>
  );
}
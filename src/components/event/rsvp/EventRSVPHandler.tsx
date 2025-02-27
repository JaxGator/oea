
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";

interface EventRSVPHandlerProps {
  eventId: string;
  onRSVP: (eventId: string, guests?: { firstName: string }[]) => void;
  children: (handleRSVP: (guests?: { firstName: string }[]) => void) => ReactNode;
}

export function EventRSVPHandler({ eventId, onRSVP, children }: EventRSVPHandlerProps) {
  const { isAuthenticated, profile } = useAuthState();
  const navigate = useNavigate();

  const handleRSVP = (guests?: { firstName: string }[]) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to RSVP for events");
      navigate("/auth");
      return;
    }

    if (!profile?.is_approved) {
      toast.error("Your account needs to be approved before you can RSVP for events");
      return;
    }

    console.log('EventRSVPHandler - Calling onRSVP with:', { eventId, guestCount: guests?.length });
    onRSVP(eventId, guests);
  };

  return <>{children(handleRSVP)}</>;
}

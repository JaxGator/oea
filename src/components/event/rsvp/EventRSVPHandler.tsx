import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthState } from "@/hooks/useAuthState";

interface EventRSVPHandlerProps {
  eventId: string;
  onRSVP: (eventId: string, guests?: { firstName: string }[]) => void;
  children: (handleRSVP: (guests?: { firstName: string }[]) => void) => React.ReactNode;
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

    onRSVP(eventId, guests);
  };

  return <>{children(handleRSVP)}</>;
}
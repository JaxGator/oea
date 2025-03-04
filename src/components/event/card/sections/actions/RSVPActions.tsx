import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { EventGuestDialog } from "@/components/event/guests/EventGuestDialog";
interface RSVPActionsProps {
  isAuthenticated: boolean;
  userRSVPStatus: string | null;
  canAddGuests: boolean;
  isFullyBooked?: boolean;
  isPastEvent: boolean;
  isSubmitting: boolean;
  currentGuests: {
    firstName: string;
  }[];
  eventTitle: string;
  onRSVP: (guests?: {
    firstName: string;
  }[]) => void;
  onCancelRSVP: () => void;
}
export function RSVPActions({
  isAuthenticated,
  userRSVPStatus,
  canAddGuests,
  isFullyBooked = false,
  isPastEvent,
  isSubmitting,
  currentGuests,
  eventTitle,
  onRSVP,
  onCancelRSVP
}: RSVPActionsProps) {
  const [showGuestDialog, setShowGuestDialog] = useState(false);

  // Don't show RSVP actions for past events
  if (isPastEvent) {
    return null;
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return <Button onClick={() => window.location.href = '/auth'}>
        Sign In to RSVP
      </Button>;
  }

  // Show cancel button if already RSVP'd
  if (userRSVPStatus === 'attending') {
    return <>
        <Button variant="destructive" onClick={onCancelRSVP} disabled={isSubmitting}>
          {isSubmitting ? <>
              Cancelling...
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </> : 'Cancel RSVP'}
        </Button>
        {canAddGuests && <EventGuestDialog open={showGuestDialog} onOpenChange={setShowGuestDialog} onSave={onRSVP} currentGuests={currentGuests} eventTitle={eventTitle} />}
      </>;
  }

  // Show RSVP options if not already RSVP'd
  return <>
      {canAddGuests ? <Button onClick={() => setShowGuestDialog(true)} disabled={isSubmitting || isFullyBooked}>RSVP</Button> : <Button onClick={() => onRSVP()} disabled={isFullyBooked || isSubmitting}>
          {isSubmitting ? <>
              Reserving Spot...
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </> : isFullyBooked ? 'Event Full' : 'RSVP'}
        </Button>}
      
      {canAddGuests && <EventGuestDialog open={showGuestDialog} onOpenChange={setShowGuestDialog} onSave={onRSVP} currentGuests={currentGuests} eventTitle={eventTitle} />}
    </>;
}

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { EventGuestDialog } from "@/components/event/guests/EventGuestDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  canJoinWaitlist?: boolean;
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
  onCancelRSVP,
  canJoinWaitlist = false
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
  
  // Show waitlist status if user is on the waitlist
  if (userRSVPStatus === 'waitlisted') {
    return <>
        <Alert variant="warning" className="mb-3">
          <AlertDescription>
            You're on the waitlist. We'll notify you if a spot becomes available.
          </AlertDescription>
        </Alert>
        <Button variant="destructive" onClick={onCancelRSVP} disabled={isSubmitting}>
          {isSubmitting ? <>
              Cancelling...
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </> : 'Leave Waitlist'}
        </Button>
      </>;
  }

  // Show RSVP options if not already RSVP'd
  return <>
      {canAddGuests ? <Button onClick={() => setShowGuestDialog(true)} disabled={isSubmitting || isFullyBooked && !canJoinWaitlist}>RSVP</Button> : <Button onClick={() => onRSVP()} disabled={(isFullyBooked && !canJoinWaitlist) || isSubmitting}>
          {isSubmitting ? <>
              {isFullyBooked && canJoinWaitlist ? 'Joining Waitlist...' : 'Reserving Spot...'}
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </> : isFullyBooked ? (canJoinWaitlist ? 'Join Waitlist' : 'Event Full') : 'RSVP'}
        </Button>}
      
      {canAddGuests && <EventGuestDialog open={showGuestDialog} onOpenChange={setShowGuestDialog} onSave={onRSVP} currentGuests={currentGuests} eventTitle={eventTitle} />}
    </>;
}


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
    return <Button 
        onClick={() => window.location.href = '/auth'}
        className="w-full sm:w-auto"
      >
        Sign In to RSVP
      </Button>;
  }

  // Show cancel button if already RSVP'd
  if (userRSVPStatus === 'attending') {
    return <div className="flex flex-col sm:flex-row gap-2 w-full">
        <Button 
          variant="destructive" 
          onClick={onCancelRSVP} 
          disabled={isSubmitting}
          className="w-full sm:w-auto"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              Cancelling...
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          ) : 'Cancel RSVP'}
        </Button>
        {canAddGuests && (
          <>
            <Button 
              variant="outline" 
              onClick={() => setShowGuestDialog(true)}
              className="w-full sm:w-auto"
            >
              Manage Guests
            </Button>
            <EventGuestDialog 
              open={showGuestDialog} 
              onOpenChange={setShowGuestDialog} 
              onSave={onRSVP} 
              currentGuests={currentGuests} 
              eventTitle={eventTitle} 
            />
          </>
        )}
      </div>;
  }
  
  // Show waitlist status if user is on the waitlist
  if (userRSVPStatus === 'waitlisted') {
    return <>
        <Alert variant="warning" className="mb-3">
          <AlertDescription>
            You're on the waitlist. We'll notify you if a spot becomes available.
          </AlertDescription>
        </Alert>
        <Button 
          variant="destructive" 
          onClick={onCancelRSVP} 
          disabled={isSubmitting}
          className="w-full sm:w-auto"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              Cancelling...
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          ) : 'Leave Waitlist'}
        </Button>
      </>;
  }

  // Show RSVP options if not already RSVP'd
  return <div className="flex flex-col sm:flex-row gap-2 w-full">
      {canAddGuests ? (
        <Button 
          onClick={() => setShowGuestDialog(true)} 
          disabled={isSubmitting || (isFullyBooked && !canJoinWaitlist)}
          variant={isFullyBooked && canJoinWaitlist ? "warning" : "success"}
          className="w-full sm:w-auto"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              {isFullyBooked && canJoinWaitlist ? 'Processing...' : 'Processing...'}
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          ) : (isFullyBooked && canJoinWaitlist ? 'Add Guests to Waitlist' : 'RSVP with Guests')}
        </Button>
      ) : (
        <Button 
          onClick={() => onRSVP()} 
          disabled={(isFullyBooked && !canJoinWaitlist) || isSubmitting}
          variant={isFullyBooked && canJoinWaitlist ? "warning" : "success"}
          className="w-full sm:w-auto"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              {isFullyBooked && canJoinWaitlist ? 'Joining Waitlist...' : 'Reserving Spot...'}
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          ) : (isFullyBooked ? (canJoinWaitlist ? 'Join Waitlist' : 'Event Full') : 'RSVP')}
        </Button>
      )}
      
      {canAddGuests && <EventGuestDialog open={showGuestDialog} onOpenChange={setShowGuestDialog} onSave={onRSVP} currentGuests={currentGuests} eventTitle={eventTitle} />}
    </div>;
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GuestList } from "../GuestList";
import { useState } from "react";

interface Guest {
  firstName: string;
}

interface RSVPButtonProps {
  isFullyBooked: boolean;
  canJoinWaitlist?: boolean;
  onRSVP: (guests?: Guest[]) => void;
}

export function RSVPButton({ isFullyBooked, canJoinWaitlist, onRSVP }: RSVPButtonProps) {
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);

  const handleRSVP = () => {
    if (guests.length > 0) {
      onRSVP(guests);
    } else {
      onRSVP();
    }
    setShowGuestDialog(false);
  };

  if (isFullyBooked && !canJoinWaitlist) {
    return (
      <Button variant="secondary" disabled>
        Event Full
      </Button>
    );
  }

  return (
    <Dialog open={showGuestDialog} onOpenChange={setShowGuestDialog}>
      <DialogTrigger asChild>
        <Button
          variant={isFullyBooked ? "secondary" : "default"}
          className={isFullyBooked ? "" : "bg-[#0d97d1] hover:bg-[#0d97d1]/90"}
        >
          {isFullyBooked ? "Join Waitlist" : "RSVP"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isFullyBooked ? "Join Event Waitlist" : "RSVP to Event"}
          </DialogTitle>
          <DialogDescription>
            {isFullyBooked 
              ? "You'll be notified if a spot becomes available"
              : "Add any guests you'd like to bring (optional)"}
          </DialogDescription>
        </DialogHeader>
        {!isFullyBooked && <GuestList onGuestsChange={setGuests} />}
        <Button 
          onClick={handleRSVP}
          className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
        >
          {isFullyBooked ? "Join Waitlist" : "Confirm RSVP"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
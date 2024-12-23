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
  onRSVP: (guests?: Guest[]) => void;
}

export function RSVPButton({ isFullyBooked, onRSVP }: RSVPButtonProps) {
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

  return (
    <Dialog open={showGuestDialog} onOpenChange={setShowGuestDialog}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
          disabled={isFullyBooked}
        >
          {isFullyBooked ? "Event Full" : "RSVP"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>RSVP to Event</DialogTitle>
          <DialogDescription>
            Add any guests you'd like to bring (optional)
          </DialogDescription>
        </DialogHeader>
        <GuestList onGuestsChange={setGuests} />
        <Button onClick={handleRSVP} className="bg-[#0d97d1] hover:bg-[#0d97d1]/90">
          Confirm RSVP
        </Button>
      </DialogContent>
    </Dialog>
  );
}
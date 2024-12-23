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

interface Guest {
  firstName: string;
}

interface AddGuestsButtonProps {
  onAddGuests: (guests: Guest[]) => void;
  currentGuests?: Guest[];
}

export function AddGuestsButton({ onAddGuests, currentGuests = [] }: AddGuestsButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Guests</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Guests</DialogTitle>
          <DialogDescription>
            Add additional guests to your RSVP
          </DialogDescription>
        </DialogHeader>
        <GuestList 
          onGuestsChange={onAddGuests}
          initialGuests={currentGuests}
        />
      </DialogContent>
    </Dialog>
  );
}
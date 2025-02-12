
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GuestListDisplay } from "../guest/GuestListDisplay";
import { GuestInput } from "../guest/GuestInput";

interface AddGuestsDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (guests: { firstName: string }[]) => void;
  currentGuests: { firstName: string }[];
}

export function AddGuestsDialog({ 
  open, 
  onClose, 
  onSubmit,
  currentGuests
}: AddGuestsDialogProps) {
  const [guests, setGuests] = useState<{ firstName: string }[]>(currentGuests);
  
  const handleAddGuest = (name: string) => {
    setGuests([...guests, { firstName: name }]);
  };

  const handleRemoveGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit(guests);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Guests</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <GuestInput 
            onAddGuest={handleAddGuest}
            isApproved={true}
          />
          <GuestListDisplay 
            guests={guests} 
            onRemoveGuest={handleRemoveGuest}
            isApproved={true}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save Guests
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

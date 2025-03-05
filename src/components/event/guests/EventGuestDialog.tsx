
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, UserPlus } from "lucide-react";

interface EventGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (guests: { firstName: string }[]) => void;
  currentGuests?: { firstName: string }[];
  eventTitle?: string;
  maxGuests?: number;
}

export function EventGuestDialog({
  open,
  onOpenChange,
  onSave,
  currentGuests = [],
  eventTitle = "Event",
  maxGuests = 5
}: EventGuestDialogProps) {
  const [guests, setGuests] = useState<{ firstName: string; id: string }[]>(
    currentGuests.map((guest, index) => ({ 
      ...guest, 
      id: `existing-${index}` 
    }))
  );

  const handleAddGuest = () => {
    if (guests.length < maxGuests) {
      setGuests([...guests, { firstName: "", id: `new-${Date.now()}` }]);
    }
  };

  const handleRemoveGuest = (id: string) => {
    setGuests(guests.filter(guest => guest.id !== id));
  };

  const handleGuestChange = (id: string, value: string) => {
    setGuests(
      guests.map(guest => 
        guest.id === id ? { ...guest, firstName: value } : guest
      )
    );
  };

  const handleSave = () => {
    // Filter out empty guest names and convert to the expected format
    const validGuests = guests
      .filter(guest => guest.firstName.trim().length > 0)
      .map(({ firstName }) => ({ firstName }));
    
    onSave(validGuests);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Guests for {eventTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          {guests.map((guest, index) => (
            <div key={guest.id} className="flex items-center gap-2">
              <Input
                placeholder={`Guest ${index + 1} name`}
                value={guest.firstName}
                onChange={(e) => handleGuestChange(guest.id, e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveGuest(guest.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {guests.length < maxGuests && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddGuest}
              className="w-full"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Guest
            </Button>
          )}
          
          {guests.length === maxGuests && (
            <p className="text-sm text-muted-foreground text-center">
              Maximum {maxGuests} guests allowed
            </p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, Plus, Loader2 } from "lucide-react";

interface EventGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (guests: { firstName: string }[]) => void;
  currentGuests?: { firstName: string }[];
  eventTitle: string;
}

export function EventGuestDialog({
  open,
  onOpenChange,
  onSave,
  currentGuests = [],
  eventTitle
}: EventGuestDialogProps) {
  const [guests, setGuests] = useState<{ firstName: string; id?: string }[]>(
    currentGuests.map((guest, index) => ({ ...guest, id: `existing-${index}` }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addGuest = () => {
    setGuests([...guests, { firstName: "", id: `new-${Date.now()}` }]);
  };

  const removeGuest = (index: number) => {
    const newGuests = [...guests];
    newGuests.splice(index, 1);
    setGuests(newGuests);
  };

  const updateGuestName = (index: number, name: string) => {
    const newGuests = [...guests];
    newGuests[index].firstName = name;
    setGuests(newGuests);
  };

  const handleSave = async () => {
    // Filter out any guests with empty names
    const validGuests = guests.filter(guest => guest.firstName.trim() !== "");
    
    if (validGuests.length === 0) {
      onOpenChange(false);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSave(validGuests);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving guests:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Guests for {eventTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="space-y-2">
            {guests.map((guest, index) => (
              <div key={guest.id} className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor={`guest-${index}`} className="sr-only">
                    Guest Name
                  </Label>
                  <Input
                    id={`guest-${index}`}
                    value={guest.firstName}
                    onChange={(e) => updateGuestName(index, e.target.value)}
                    placeholder="Guest name"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeGuest(index)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ))}
          </div>
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={addGuest}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Guest
          </Button>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                Saving...
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

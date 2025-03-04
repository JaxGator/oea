
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { X, UserPlus, Save } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (guests: { firstName: string }[]) => void;
  currentGuests?: { firstName: string }[];
  eventTitle?: string;
  maxGuests?: number;
  isSaving?: boolean;
}

export function EventGuestDialog({
  open,
  onOpenChange,
  onSave,
  currentGuests = [],
  eventTitle = "Event",
  maxGuests = 5,
  isSaving = false
}: EventGuestDialogProps) {
  const [guests, setGuests] = useState<{ firstName: string; id: string }[]>([]);
  const isMobile = useIsMobile();

  // Initialize guests when dialog opens or currentGuests changes
  useEffect(() => {
    if (open || currentGuests.length !== guests.length) {
      setGuests(
        currentGuests.map((guest, index) => ({ 
          ...guest, 
          id: `existing-${index}` 
        }))
      );
    }
  }, [open, currentGuests, guests.length]);

  // Auto-add a first guest if there are none yet
  useEffect(() => {
    if (open && guests.length === 0) {
      handleAddGuest();
    }
  }, [open]);

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

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Allow adding new guest with Enter if there's content and not at max
    if (e.key === 'Enter' && guests[index].firstName.trim() && guests.length < maxGuests) {
      e.preventDefault();
      handleAddGuest();
      // Focus the new input after a short delay
      setTimeout(() => {
        const inputs = document.querySelectorAll('input[id^="guest-"]');
        if (inputs[inputs.length - 1]) {
          (inputs[inputs.length - 1] as HTMLInputElement).focus();
        }
      }, 50);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-md ${isMobile ? 'p-4' : ''}`}>
        <DialogHeader>
          <DialogTitle className="text-center">
            {currentGuests.length > 0 ? 'Manage Guests' : 'Add Guests'} for {eventTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4 max-h-[60vh] overflow-y-auto p-1">
          {guests.map((guest, index) => (
            <div key={guest.id} className="flex items-center gap-2">
              <Input
                id={`guest-${index}`}
                placeholder={`Guest ${index + 1} name`}
                value={guest.firstName}
                onChange={(e) => handleGuestChange(guest.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="flex-1"
                autoFocus={index === guests.length - 1 && index > 0}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveGuest(guest.id)}
                aria-label="Remove guest"
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
        
        <DialogFooter className={`${isMobile ? 'flex-col gap-2' : ''}`}>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className={isMobile ? "w-full" : ""}
          >
            Cancel
          </Button>
          <LoadingButton 
            isLoading={isSaving}
            loadingText="Saving..."
            onClick={handleSave}
            className={isMobile ? "w-full" : ""}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Guests
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventForm } from "./EventForm";
import { WaitlistManager } from "../admin/events/WaitlistManager";
import { Separator } from "@/components/ui/separator";
import { EventFormData } from "./EventFormTypes";
import { useEffect } from "react";

interface EventEditDialogProps {
  event: EventFormData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EventEditDialog({ event, open, onOpenChange, onSuccess }: EventEditDialogProps) {
  // Ensure cleanup when dialog closes
  useEffect(() => {
    return () => {
      // Cleanup function
      if (!open) {
        onSuccess();
      }
    };
  }, [open, onSuccess]);

  const handleSuccess = () => {
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Event: {event.title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <EventForm
            initialData={event}
            onSuccess={handleSuccess}
          />
          
          {event.waitlist_enabled && (
            <>
              <Separator className="my-6" />
              <WaitlistManager
                eventId={event.id}
                maxGuests={event.max_guests}
                waitlistCapacity={event.waitlist_capacity}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
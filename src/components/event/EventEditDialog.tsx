import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventForm } from "./EventForm";
import { WaitlistManager } from "../admin/events/WaitlistManager";
import { Separator } from "@/components/ui/separator";
import { EventFormData } from "./EventFormTypes";

interface EventEditDialogProps {
  event: EventFormData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EventEditDialog({ event, open, onOpenChange, onSuccess }: EventEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <div className="overflow-y-auto max-h-full">
          <DialogHeader>
            <DialogTitle>Edit Event: {event.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-6">
            <EventForm
              initialData={event}
              onSuccess={onSuccess}
            />
            
            {event.waitlist_enabled && (
              <>
                <Separator />
                <WaitlistManager
                  eventId={event.id}
                  maxGuests={event.max_guests}
                  waitlistCapacity={event.waitlist_capacity}
                />
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
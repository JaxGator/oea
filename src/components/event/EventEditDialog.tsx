import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventForm } from "./EventForm";
import { Event } from "@/types/event";

interface EventEditDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EventEditDialog({ event, open, onOpenChange, onSuccess }: EventEditDialogProps) {
  const isPastEvent = new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));
  const isWixEvent = event.description === 'Imported from Wix';

  const handleSuccess = () => {
    onSuccess();
    onOpenChange(false);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            {isPastEvent ? 
              "You can update event details and attendance numbers for this past event." :
              "Make changes to the event details below."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <EventForm
            initialData={{
              id: event.id,
              title: event.title,
              description: event.description || "",
              date: event.date,
              time: event.time,
              location: event.location,
              max_guests: event.max_guests,
              image_url: event.image_url || "",
            }}
            onSuccess={handleSuccess}
            isPastEvent={isPastEvent}
            isWixEvent={isWixEvent}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
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
  const handleSuccess = () => {
    onSuccess();
    onOpenChange(false);
    // Add a small delay before refreshing to ensure the dialog closes smoothly
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Make changes to the event details below.
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
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
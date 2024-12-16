import {
  Dialog,
  DialogContent,
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <EventForm
          initialData={{
            id: event.id,
            title: event.title,
            description: event.description || "",
            date: event.date,
            time: event.time,
            location: event.location,
            max_guests: event.max_guests,
            image_url: event.image_url,
          }}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
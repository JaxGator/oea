import { Event } from "@/types/event";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EventForm } from "./EventForm";

interface EventEditDialogProps {
  event: Event;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  onSuccess?: () => void;
}

export function EventEditDialog({
  event,
  showDialog,
  setShowDialog,
  onSuccess
}: EventEditDialogProps) {
  return (
    <Dialog 
      open={showDialog} 
      onOpenChange={(open) => {
        setShowDialog(open);
      }}
    >
      <DialogContent className="max-w-4xl">
        <div className="space-y-6">
          <EventForm 
            initialData={event}
            isPastEvent={new Date(event.date) < new Date()}
            isWixEvent={!!event.imported_rsvp_count}
            onSuccess={() => {
              if (onSuccess) onSuccess();
              setShowDialog(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
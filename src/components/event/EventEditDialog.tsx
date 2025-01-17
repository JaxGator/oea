import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EventForm } from "@/components/event/EventForm";
import type { Event } from "@/types/event";

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
  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    setShowDialog(false);
  };

  return (
    <Dialog 
      open={showDialog} 
      onOpenChange={setShowDialog}
    >
      <DialogContent className="max-w-4xl">
        <div className="space-y-6">
          <EventForm 
            event={event}
            isPastEvent={new Date(event.date) < new Date()}
            isWixEvent={!!event.imported_rsvp_count}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
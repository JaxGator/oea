import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EventForm } from "@/components/event/EventForm";
import type { Event } from "@/types/event";

interface EventEditDialogProps {
  initialData: Event;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  onSuccess?: () => void;
  isPastEvent?: boolean;
  isWixEvent?: boolean;
}

export function EventEditDialog({ 
  initialData, 
  showDialog, 
  setShowDialog, 
  onSuccess,
  isPastEvent = false,
  isWixEvent = false
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
            initialData={initialData}
            isPastEvent={isPastEvent}
            isWixEvent={isWixEvent}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
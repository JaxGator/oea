
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventForm } from "@/components/event/EventForm";
import type { Event } from "@/types/event";
import { useEffect } from "react";

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (showDialog) {
        setShowDialog(false);
      }
    };
  }, [showDialog, setShowDialog]);

  return (
    <Dialog 
      open={showDialog} 
      onOpenChange={setShowDialog}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? 'Edit Event' : 'Create Event'}
          </DialogTitle>
        </DialogHeader>
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

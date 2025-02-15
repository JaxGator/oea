
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventForm } from "@/components/event/EventForm";
import type { Event } from "@/types/event";
import { useEffect, useState } from "react";

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
  const [isClosing, setIsClosing] = useState(false);

  const handleSuccess = () => {
    setIsClosing(true);
    if (onSuccess) {
      onSuccess();
    }
    setShowDialog(false);
    setIsClosing(false);
  };

  // Prevent dialog from closing when clicking outside
  const handleOpenChange = (open: boolean) => {
    if (!open && !isClosing) {
      // Only allow closing via the cancel or submit buttons
      return;
    }
    setShowDialog(open);
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
      onOpenChange={handleOpenChange}
    >
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
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

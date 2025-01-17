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
  // Handle dialog cleanup
  useEffect(() => {
    if (!open) {
      // Only trigger cleanup when dialog is actually closing
      onOpenChange(false);
    }
  }, [open, onOpenChange]);

  const handleSuccess = () => {
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <EventForm 
            event={event} 
            onSuccess={handleSuccess}
            submitLabel="Update Event"
          />
          
          <Separator />
          
          <WaitlistManager eventId={event.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
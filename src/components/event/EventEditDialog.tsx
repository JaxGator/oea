import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventForm } from "@/components/event/EventForm";
import { WaitlistManager } from "@/components/admin/events/WaitlistManager";
import { Event } from "@/types/event";

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
  useEffect(() => {
    return () => {
      if (!showDialog && onSuccess) {
        onSuccess();
      }
    };
  }, [showDialog, onSuccess]);

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <EventForm 
            initialData={event}
            onSuccess={() => {
              setShowDialog(false);
              if (onSuccess) onSuccess();
            }}
          />
          
          {event && (
            <WaitlistManager 
              eventId={event.id}
              maxGuests={event.max_guests}
              waitlistCapacity={event.waitlist_capacity || 0}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
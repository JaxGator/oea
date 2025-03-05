
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventEditDialogContent } from "./dialog/EventEditDialogContent";
import { useDialogState } from "./dialog/useDialogState";
import type { Event } from "@/types/event";

interface EventEditDialogProps {
  initialData: Event;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  onSuccess?: () => void;
  isPastEvent?: boolean;
  isWixEvent?: boolean;
  forceAdmin?: boolean;
  forceCanManage?: boolean;
}

export function EventEditDialog({ 
  initialData, 
  showDialog, 
  setShowDialog, 
  onSuccess,
  isPastEvent = false,
  isWixEvent = false,
  forceAdmin = false,
  forceCanManage = false
}: EventEditDialogProps) {
  const {
    isClosing,
    localShowDialog,
    handleSuccess,
    handleOpenChange
  } = useDialogState(showDialog, setShowDialog, onSuccess);

  return (
    <Dialog 
      open={localShowDialog} 
      onOpenChange={handleOpenChange}
    >
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        onEscapeKeyDown={(e) => {
          if (isClosing) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (isClosing) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? 'Edit Event' : 'Create Event'}
          </DialogTitle>
        </DialogHeader>
        
        <EventEditDialogContent
          initialData={initialData}
          isPastEvent={isPastEvent}
          isWixEvent={isWixEvent}
          forceAdmin={forceAdmin}
          forceCanManage={forceCanManage}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}

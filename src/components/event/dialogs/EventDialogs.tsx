import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventCardDetailedView } from "@/components/event/card/EventCardDetailedView";
import { EventEditDialog } from "@/components/event/EventEditDialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Event } from "@/types/event";

interface EventDialogsProps {
  event: Event;
  showDetailsDialog: boolean;
  setShowDetailsDialog: (show: boolean) => void;
  showEditDialog: boolean;
  setShowEditDialog: (show: boolean) => void;
  onEditSuccess?: () => void;
}

export function EventDialogs({
  event,
  showDetailsDialog,
  setShowDetailsDialog,
  showEditDialog,
  setShowEditDialog,
  onEditSuccess
}: EventDialogsProps) {
  const handleEditSuccess = () => {
    setShowEditDialog(false);
    if (onEditSuccess) {
      onEditSuccess();
    }
  };

  const handleDetailsClose = () => {
    setShowDetailsDialog(false);
    setShowEditDialog(false);
  };

  return (
    <>
      <Dialog 
        open={showDetailsDialog} 
        onOpenChange={handleDetailsClose}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 flex flex-row items-center justify-between">
            <DialogTitle className="text-2xl">{event.title}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDetailsClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <EventCardDetailedView 
              event={event}
              showEditDialog={showEditDialog}
              setShowEditDialog={setShowEditDialog}
            />
          </div>
        </DialogContent>
      </Dialog>

      {showEditDialog && (
        <EventEditDialog
          event={event}
          showDialog={showEditDialog}
          setShowDialog={setShowEditDialog}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
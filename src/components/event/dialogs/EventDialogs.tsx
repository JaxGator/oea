import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EventCardDetailedView } from "../card/EventCardDetailedView";
import { EventEditDialog } from "../EventEditDialog";
import { Event } from "@/types/event";

interface EventDialogsProps {
  event: Event;
  showDetailsDialog: boolean;
  setShowDetailsDialog: (show: boolean) => void;
  showEditDialog: boolean;
  setShowEditDialog: (show: boolean) => void;
  rsvpCount: number;
  attendeeNames: string[];
  userRSVPStatus: string | null;
  isAdmin: boolean;
  canManageEvents: boolean;
  isPastEvent: boolean;
  isWixEvent: boolean;
  canAddGuests: boolean;
  currentGuests?: { firstName: string }[];
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onDelete: () => void;
  handleEditSuccess: () => void;
}

export function EventDialogs({
  event,
  showDetailsDialog,
  setShowDetailsDialog,
  showEditDialog,
  setShowEditDialog,
  rsvpCount,
  attendeeNames,
  userRSVPStatus,
  isAdmin,
  canManageEvents,
  isPastEvent,
  isWixEvent,
  canAddGuests,
  currentGuests = [],
  onRSVP,
  onCancelRSVP,
  onDelete,
  handleEditSuccess,
}: EventDialogsProps) {
  // Handle dialog state changes
  const handleDetailsDialogChange = (open: boolean) => {
    setShowDetailsDialog(open);
    if (!open && showEditDialog) {
      setShowEditDialog(false);
    }
  };

  const handleEditDialogChange = (open: boolean) => {
    setShowEditDialog(open);
    if (!open && showDetailsDialog) {
      setShowDetailsDialog(false);
    }
  };

  return (
    <>
      <Dialog open={showDetailsDialog} onOpenChange={handleDetailsDialogChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <EventCardDetailedView
                event={event}
                rsvpCount={rsvpCount}
                attendeeNames={attendeeNames}
                userRSVPStatus={userRSVPStatus}
                isAdmin={isAdmin}
                canManageEvents={canManageEvents}
                isPastEvent={isPastEvent}
                isWixEvent={isWixEvent}
                canAddGuests={canAddGuests}
                currentGuests={currentGuests}
                onRSVP={onRSVP}
                onCancelRSVP={onCancelRSVP}
                onEdit={() => setShowEditDialog(true)}
                onDelete={onDelete}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EventEditDialog
        event={event}
        open={showEditDialog}
        onOpenChange={handleEditDialogChange}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
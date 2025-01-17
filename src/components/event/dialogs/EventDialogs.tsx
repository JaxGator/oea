import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventCardDetailedView } from "@/components/event/card/EventCardDetailedView";
import { EventEditDialog } from "@/components/event/EventEditDialog";
import type { Event } from "@/types/event";

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
  currentGuests: { firstName: string }[];
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onDelete?: () => void;
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
  currentGuests,
  onRSVP,
  onCancelRSVP,
  onDelete,
  handleEditSuccess,
}: EventDialogsProps) {
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
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
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
        </DialogContent>
      </Dialog>

      {showEditDialog && (
        <EventEditDialog
          initialData={event}
          showDialog={showEditDialog}
          setShowDialog={setShowEditDialog}
          onSuccess={handleEditSuccess}
          isPastEvent={isPastEvent}
          isWixEvent={isWixEvent}
        />
      )}
    </>
  );
}
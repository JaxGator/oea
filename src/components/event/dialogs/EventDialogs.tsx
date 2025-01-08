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
  isPastEvent: boolean;
  isWixEvent: boolean;
  canAddGuests: boolean;
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
  isPastEvent,
  isWixEvent,
  canAddGuests,
  onRSVP,
  onCancelRSVP,
  onDelete,
  handleEditSuccess,
}: EventDialogsProps) {
  return (
    <>
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6">
          <div className="space-y-6">
            <EventCardDetailedView
              event={event}
              rsvpCount={rsvpCount}
              attendeeNames={attendeeNames}
              userRSVPStatus={userRSVPStatus}
              isAdmin={isAdmin}
              isPastEvent={isPastEvent}
              isWixEvent={isWixEvent}
              canAddGuests={canAddGuests}
              onRSVP={onRSVP}
              onCancelRSVP={onCancelRSVP}
              onEdit={() => setShowEditDialog(true)}
              onDelete={onDelete}
            />
          </div>
        </DialogContent>
      </Dialog>

      <EventEditDialog
        event={event}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
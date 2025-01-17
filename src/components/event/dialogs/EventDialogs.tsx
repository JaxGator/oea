import { Event } from "@/types/event";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EventCardDetailedView } from "../card/EventCardDetailedView";
import { EventEditDialog } from "../EventEditDialog";

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
  return (
    <>
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
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
                onEdit={() => {
                  setShowDetailsDialog(false);
                  setShowEditDialog(true);
                }}
                onDelete={onDelete}
              />
            </div>
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
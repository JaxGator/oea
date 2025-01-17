import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Event } from "@/types/event";
import { EventEditDialog } from "../EventEditDialog";
import { EventDetailsSection } from "../card/sections/EventDetailsSection";
import { EventActionsSection } from "../card/sections/EventActionsSection";

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
              <EventDetailsSection
                event={event}
                rsvpCount={rsvpCount}
                maxGuests={event.max_guests}
                attendeeNames={attendeeNames}
                isPastEvent={isPastEvent}
              />
              
              <EventActionsSection
                isAdmin={isAdmin}
                canManageEvents={canManageEvents}
                userRSVPStatus={userRSVPStatus}
                isFullyBooked={rsvpCount >= event.max_guests}
                canJoinWaitlist={event.waitlist_enabled}
                onRSVP={onRSVP}
                onCancelRSVP={onCancelRSVP}
                onEdit={() => setShowEditDialog(true)}
                onDelete={onDelete}
                onTogglePublish={() => {}}
                isPastEvent={isPastEvent}
                isWixEvent={isWixEvent}
                isPublished={event.is_published ?? true}
                canAddGuests={canAddGuests}
                currentGuests={currentGuests}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EventEditDialog
        event={event}
        showDialog={showEditDialog}
        setShowDialog={setShowEditDialog}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
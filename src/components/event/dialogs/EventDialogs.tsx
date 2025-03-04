
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventCardDetailedView } from "@/components/event/card/EventCardDetailedView";
import { EventEditDialog } from "@/components/event/EventEditDialog";
import type { Event } from "@/types/event";
import { useEffect } from "react";
import { useAuthState } from "@/hooks/useAuthState";

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
  isAuthenticated?: boolean;
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
  isAuthenticated = false,
}: EventDialogsProps) {
  const { user } = useAuthState();
  
  // Force isAdmin to be true if user has admin status in their profile
  const effectiveIsAdmin = user?.is_admin === true || isAdmin === true;
  const effectiveCanManage = effectiveIsAdmin || canManageEvents;

  // Log dialog state and admin status for debugging
  useEffect(() => {
    console.log("EventDialogs state:", {
      eventId: event?.id,
      eventTitle: event?.title,
      showDetailsDialog,
      showEditDialog,
      isAuthenticated,
      userIsAdmin: user?.is_admin,
      propsIsAdmin: isAdmin,
      effectiveIsAdmin,
      canManageEvents: effectiveCanManage,
      createdBy: event?.created_by,
      timestamp: new Date().toISOString()
    });
  }, [event, showDetailsDialog, showEditDialog, isAuthenticated, isAdmin, effectiveIsAdmin, effectiveCanManage, user?.is_admin]);

  return (
    <>
      <Dialog 
        open={showDetailsDialog} 
        onOpenChange={setShowDetailsDialog}
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
              isAdmin={effectiveIsAdmin}
              canManageEvents={effectiveCanManage}
              isPastEvent={isPastEvent}
              isWixEvent={isWixEvent}
              canAddGuests={canAddGuests}
              currentGuests={currentGuests}
              onRSVP={onRSVP}
              onCancelRSVP={onCancelRSVP}
              onEdit={() => {
                console.log("Edit button clicked in details view");
                setShowEditDialog(true);
              }}
              onDelete={onDelete}
              onTogglePublish={() => {}}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Always render the edit dialog but control visibility through "open" prop */}
      <EventEditDialog
        initialData={event}
        showDialog={showEditDialog}
        setShowDialog={setShowEditDialog}
        onSuccess={handleEditSuccess}
        isPastEvent={isPastEvent}
        isWixEvent={isWixEvent}
        forceAdmin={effectiveIsAdmin}
        forceCanManage={effectiveCanManage}
      />
    </>
  );
}

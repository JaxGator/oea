
import { Event } from "@/types/event";
import { EventRSVPHandler } from "../rsvp/EventRSVPHandler";
import { EventCardState } from "../card/EventCardState";
import { EventCardInteractions } from "../card/EventCardInteractions";
import { EventDialogs } from "../dialogs/EventDialogs";
import { processAttendeeNames } from "../attendees/EventAttendeeProcessor";

interface EventRSVPContainerProps {
  event: Event;
  onRSVP: (eventId: string, guests?: { firstName: string }[]) => void;
  onCancelRSVP: (eventId: string) => void;
  userRSVPStatus?: string | null;
  onUpdate?: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
  isAuthChecking?: boolean;
  requireAuth?: boolean;
  showDelete?: boolean;
  isAuthenticated?: boolean;
}

export function EventRSVPContainer({
  event,
  onRSVP,
  onCancelRSVP,
  userRSVPStatus,
  onUpdate,
  onSelect,
  isSelected = false,
  isAuthChecking = false,
  requireAuth = false,
  showDelete = false,
  isAuthenticated = false
}: EventRSVPContainerProps) {
  console.log('EventRSVPContainer - Auth state:', { isAuthenticated, userRSVPStatus });

  const handleCardClick = () => {
    if (onSelect && event.latitude && event.longitude) {
      onSelect();
    }
  };

  return (
    <EventRSVPHandler eventId={event.id} onRSVP={onRSVP}>
      {(handleRSVP) => (
        <EventCardState
          event={event}
          userRSVPStatus={userRSVPStatus}
          onUpdate={onUpdate}
          isAuthenticated={isAuthenticated}
        >
          {(stateProps) => {
            const attendeeNames = processAttendeeNames(stateProps.attendees);

            return (
              <div onClick={handleCardClick}>
                <EventCardInteractions
                  event={event}
                  isAdmin={stateProps.isAdmin}
                  canManageEvents={stateProps.canManageEvents}
                  rsvpData={stateProps.rsvpData}
                  userRSVPStatus={userRSVPStatus || null}
                  isPastEvent={stateProps.isPastEvent}
                  canAddGuests={stateProps.canAddGuests}
                  guests={stateProps.guests}
                  isSelected={isSelected}
                  editedRSVPCount={stateProps.editedRSVPCount}
                  isEditingRSVP={stateProps.isEditingRSVP}
                  onRSVP={handleRSVP}
                  onCancelRSVP={() => onCancelRSVP(event.id)}
                  setShowEditDialog={stateProps.setShowEditDialog}
                  setShowDetailsDialog={stateProps.setShowDetailsDialog}
                  handleDelete={stateProps.handleDelete}
                  isPublished={event.is_published ?? true}
                  onTogglePublish={stateProps.handleTogglePublish}
                  onEditRSVP={stateProps.handleEditRSVP}
                  onSaveRSVP={stateProps.handleSaveRSVP}
                  onCancelEdit={stateProps.handleCancelEdit}
                  onRSVPCountChange={stateProps.handleRSVPCountChange}
                  isAuthChecking={isAuthChecking}
                  requireAuth={requireAuth}
                  showDelete={showDelete}
                  isAuthenticated={isAuthenticated}
                />

                <EventDialogs
                  event={event}
                  showDetailsDialog={stateProps.showDetailsDialog}
                  setShowDetailsDialog={stateProps.setShowDetailsDialog}
                  showEditDialog={stateProps.showEditDialog}
                  setShowEditDialog={stateProps.setShowEditDialog}
                  rsvpCount={stateProps.rsvpData.confirmedCount}
                  attendeeNames={attendeeNames}
                  userRSVPStatus={userRSVPStatus || null}
                  isAdmin={stateProps.isAdmin}
                  canManageEvents={stateProps.canManageEvents}
                  isPastEvent={stateProps.isPastEvent}
                  isWixEvent={stateProps.isWixEvent}
                  canAddGuests={stateProps.canAddGuests}
                  currentGuests={stateProps.guests}
                  onRSVP={handleRSVP}
                  onCancelRSVP={() => onCancelRSVP(event.id)}
                  onDelete={stateProps.handleDelete}
                  handleEditSuccess={stateProps.handleEditSuccess}
                  isAuthenticated={isAuthenticated}
                />
              </div>
            );
          }}
        </EventCardState>
      )}
    </EventRSVPHandler>
  );
}

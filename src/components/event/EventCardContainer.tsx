import { Event } from "@/types/event";
import { EventDialogs } from "./dialogs/EventDialogs";
import { EventRSVPHandler } from "./rsvp/EventRSVPHandler";
import { EventCardState } from "./card/EventCardState";
import { EventCardInteractions } from "./card/EventCardInteractions";
import { processAttendeeNames } from "./attendees/EventAttendeeProcessor";

interface EventCardContainerProps {
  event: Event;
  onRSVP: (eventId: string, guests?: { firstName: string }[]) => void;
  onCancelRSVP: (eventId: string) => void;
  userRSVPStatus?: string | null;
  onUpdate?: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
}

export function EventCardContainer({
  event,
  onRSVP,
  onCancelRSVP,
  userRSVPStatus,
  onUpdate,
  onSelect,
  isSelected = false
}: EventCardContainerProps) {
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
        >
          {({
            isAdmin,
            canManageEvents,
            rsvpData,
            attendees,
            guests,
            isPastEvent,
            isWixEvent,
            canAddGuests,
            showEditDialog,
            showDetailsDialog,
            editedRSVPCount,
            isEditingRSVP,
            handleEditSuccess,
            handleDelete,
            handleTogglePublish,
            setShowEditDialog,
            setShowDetailsDialog,
            handleEditRSVP,
            handleSaveRSVP,
            handleCancelEdit,
            handleRSVPCountChange,
          }) => {
            const attendeeNames = processAttendeeNames(attendees);

            return (
              <div onClick={handleCardClick}>
                <EventCardInteractions
                  event={event}
                  isAdmin={isAdmin}
                  canManageEvents={canManageEvents}
                  rsvpData={rsvpData}
                  userRSVPStatus={userRSVPStatus || null}
                  isPastEvent={isPastEvent}
                  canAddGuests={canAddGuests}
                  guests={guests}
                  isSelected={isSelected}
                  editedRSVPCount={editedRSVPCount}
                  isEditingRSVP={isEditingRSVP}
                  onRSVP={handleRSVP}
                  onCancelRSVP={() => onCancelRSVP(event.id)}
                  setShowEditDialog={setShowEditDialog}
                  setShowDetailsDialog={setShowDetailsDialog}
                  handleDelete={handleDelete}
                  isPublished={event.is_published ?? true}
                  onTogglePublish={handleTogglePublish}
                  onEditRSVP={handleEditRSVP}
                  onSaveRSVP={handleSaveRSVP}
                  onCancelEdit={handleCancelEdit}
                  onRSVPCountChange={handleRSVPCountChange}
                />

                <EventDialogs
                  event={event}
                  showDetailsDialog={showDetailsDialog}
                  setShowDetailsDialog={setShowDetailsDialog}
                  showEditDialog={showEditDialog}
                  setShowEditDialog={setShowEditDialog}
                  rsvpCount={rsvpData.confirmedCount}
                  attendeeNames={attendeeNames}
                  userRSVPStatus={userRSVPStatus || null}
                  isAdmin={isAdmin}
                  canManageEvents={canManageEvents}
                  isPastEvent={isPastEvent}
                  isWixEvent={isWixEvent}
                  canAddGuests={canAddGuests}
                  currentGuests={guests}
                  onRSVP={handleRSVP}
                  onCancelRSVP={() => onCancelRSVP(event.id)}
                  onDelete={handleDelete}
                  handleEditSuccess={handleEditSuccess}
                />
              </div>
            );
          }}
        </EventCardState>
      )}
    </EventRSVPHandler>
  );
}
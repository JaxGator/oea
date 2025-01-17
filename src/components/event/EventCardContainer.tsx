import { Event } from "@/types/event";
import { EventDialogs } from "./dialogs/EventDialogs";
import { EventRSVPHandler } from "./rsvp/EventRSVPHandler";
import { EventCardState } from "./card/EventCardState";
import { EventCardInteractions } from "./card/EventCardInteractions";

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
            handleEditSuccess,
            handleDelete,
            handleTogglePublish,
            setShowEditDialog,
            setShowDetailsDialog,
          }) => (
            <>
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
                onSelect={onSelect}
                onRSVP={handleRSVP}
                onCancelRSVP={() => onCancelRSVP(event.id)}
                setShowEditDialog={setShowEditDialog}
                setShowDetailsDialog={setShowDetailsDialog}
                handleDelete={handleDelete}
                isPublished={event.is_published ?? true}
                onTogglePublish={handleTogglePublish}
              />

              <EventDialogs
                event={event}
                showDetailsDialog={showDetailsDialog}
                setShowDetailsDialog={setShowDetailsDialog}
                showEditDialog={showEditDialog}
                setShowEditDialog={setShowEditDialog}
                rsvpCount={rsvpData.confirmedCount}
                attendeeNames={attendees.map(attendee => {
                  if (!attendee.profile) return '';
                  // Handle both full_name and username
                  return attendee.profile.full_name || attendee.profile.username || '';
                }).filter(name => name !== '')}
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
            </>
          )}
        </EventCardState>
      )}
    </EventRSVPHandler>
  );
}
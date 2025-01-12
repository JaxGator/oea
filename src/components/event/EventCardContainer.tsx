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
            setShowEditDialog,
            setShowDetailsDialog,
            handleInteraction,
          }) => (
            <>
              <EventCardInteractions
                event={event}
                isAdmin={isAdmin}
                rsvpData={rsvpData}
                userRSVPStatus={userRSVPStatus || null}
                isPastEvent={isPastEvent}
                canAddGuests={canAddGuests}
                guests={guests}
                isSelected={isSelected}
                onSelect={onSelect}
                onRSVP={handleRSVP}
                onCancelRSVP={() => onCancelRSVP(event.id)}
                handleInteraction={handleInteraction}
                setShowEditDialog={setShowEditDialog}
                handleDelete={handleDelete}
              />

              <EventDialogs
                event={event}
                showDetailsDialog={showDetailsDialog}
                setShowDetailsDialog={setShowDetailsDialog}
                showEditDialog={showEditDialog}
                setShowEditDialog={setShowEditDialog}
                rsvpCount={rsvpData.confirmedCount}
                attendeeNames={attendees.map(attendee => {
                  const fullName = attendee.profile.full_name;
                  const firstName = fullName ? fullName.split(' ')[0] : attendee.profile.username;
                  return firstName;
                })}
                userRSVPStatus={userRSVPStatus || null}
                isAdmin={isAdmin}
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
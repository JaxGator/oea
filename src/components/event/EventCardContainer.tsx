import { Event } from "@/types/event";
import { EventCardWrapper } from "./EventCardWrapper";
import { EventCardHeader } from "./EventCardHeader";
import { EventCardContent } from "./card/EventCardContent";
import { EventDialogs } from "./dialogs/EventDialogs";
import { useEventCard } from "@/hooks/useEventCard";
import { useEventDialogs } from "@/hooks/useEventDialogs";
import { useEventInteraction } from "@/hooks/events/useEventInteraction";
import { EventRSVPHandler } from "./rsvp/EventRSVPHandler";

interface EventCardContainerProps {
  event: Event;
  onRSVP: (eventId: string, guests?: { firstName: string }[]) => void;
  onCancelRSVP: (eventId: string) => void;
  userRSVPStatus?: string | null;
  onUpdate?: () => void;
}

export function EventCardContainer({
  event,
  onRSVP,
  onCancelRSVP,
  userRSVPStatus,
  onUpdate
}: EventCardContainerProps) {
  const { 
    isAdmin,
    rsvpCount,
    attendees,
    handleEditSuccess,
    handleDelete,
  } = useEventCard(event.id, onUpdate);

  const { showEditDialog, setShowEditDialog } = useEventDialogs();
  const { showDetailsDialog, setShowDetailsDialog, handleInteraction } = useEventInteraction();

  const isPastEvent = new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));
  const isWixEvent = event.description === 'Imported from Wix';
  const canAddGuests = isAdmin || userRSVPStatus === 'attending';

  const attendeeNames = attendees.map(attendee => {
    const fullName = attendee.profile.full_name;
    const firstName = fullName ? fullName.split(' ')[0] : attendee.profile.username;
    return firstName;
  });

  return (
    <EventRSVPHandler eventId={event.id} onRSVP={onRSVP}>
      {(handleRSVP) => (
        <>
          <EventCardWrapper
            title={event.title}
            onInteraction={handleInteraction}
            onKeyDown={handleInteraction}
          >
            <EventCardHeader imageUrl={event.image_url} title={event.title} />
            <EventCardContent
              date={event.date}
              location={event.location}
              rsvpCount={rsvpCount}
              maxGuests={event.max_guests}
              isWixEvent={isWixEvent}
              isAdmin={isAdmin}
              userRSVPStatus={userRSVPStatus || null}
              isPastEvent={isPastEvent}
              canAddGuests={canAddGuests}
              onRSVP={handleRSVP}
              onCancelRSVP={() => onCancelRSVP(event.id)}
              onEdit={() => setShowEditDialog(true)}
              onDelete={handleDelete}
            />
          </EventCardWrapper>

          <EventDialogs
            event={event}
            showDetailsDialog={showDetailsDialog}
            setShowDetailsDialog={setShowDetailsDialog}
            showEditDialog={showEditDialog}
            setShowEditDialog={setShowEditDialog}
            rsvpCount={rsvpCount}
            attendeeNames={attendeeNames}
            userRSVPStatus={userRSVPStatus || null}
            isAdmin={isAdmin}
            isPastEvent={isPastEvent}
            isWixEvent={isWixEvent}
            canAddGuests={canAddGuests}
            onRSVP={handleRSVP}
            onCancelRSVP={() => onCancelRSVP(event.id)}
            onDelete={handleDelete}
            handleEditSuccess={handleEditSuccess}
          />
        </>
      )}
    </EventRSVPHandler>
  );
}
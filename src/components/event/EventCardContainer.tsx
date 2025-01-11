import { Event } from "@/types/event";
import { EventCardWrapper } from "./EventCardWrapper";
import { EventCardHeader } from "./EventCardHeader";
import { EventCardContent } from "./card/EventCardContent";
import { EventDialogs } from "./dialogs/EventDialogs";
import { useEventCard } from "@/hooks/useEventCard";
import { useEventDialogs } from "@/hooks/useEventDialogs";
import { useEventInteraction } from "@/hooks/events/useEventInteraction";
import { EventRSVPHandler } from "./rsvp/EventRSVPHandler";
import { useEventWaitlist } from "@/hooks/events/useEventWaitlist";
import { useEventRSVPData } from "@/hooks/events/useEventRSVPData";
import { useEventGuestData } from "@/hooks/events/useEventGuestData";

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
  const { 
    isAdmin,
    rsvpCount,
    attendees,
    waitlistedAttendees,
    handleEditSuccess,
    handleDelete,
  } = useEventCard(event.id, onUpdate);

  const { showEditDialog, setShowEditDialog } = useEventDialogs();
  const { showDetailsDialog, setShowDetailsDialog, handleInteraction } = useEventInteraction();
  const { waitlistCount } = useEventWaitlist(event.id, event.waitlist_enabled);
  const { data: rsvpData = { confirmedCount: 0, waitlistCount: 0 } } = useEventRSVPData(event.id);
  const { data: guests = [] } = useEventGuestData(event.id, userRSVPStatus);

  const isPastEvent = new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));
  const isWixEvent = event.description === 'Imported from Wix';
  const canAddGuests = isAdmin || userRSVPStatus === 'attending';

  const attendeeNames = attendees.map(attendee => {
    const fullName = attendee.profile.full_name;
    const firstName = fullName ? fullName.split(' ')[0] : attendee.profile.username;
    return firstName;
  });

  const waitlistedNames = waitlistedAttendees.map(attendee => {
    const fullName = attendee.profile.full_name;
    const firstName = fullName ? fullName.split(' ')[0] : attendee.profile.username;
    return firstName;
  });

  const handleCardClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (onSelect) {
      onSelect();
    }
    handleInteraction(e);
  };

  return (
    <EventRSVPHandler eventId={event.id} onRSVP={onRSVP}>
      {(handleRSVP) => (
        <>
          <EventCardWrapper
            title={event.title}
            onInteraction={handleCardClick}
            onKeyDown={handleCardClick}
            isFeatured={event.is_featured}
            isSelected={isSelected}
          >
            <EventCardHeader imageUrl={event.image_url} title={event.title} />
            <EventCardContent
              event={event}
              date={event.date}
              location={event.location}
              rsvpCount={rsvpData.confirmedCount}
              maxGuests={event.max_guests}
              isWixEvent={isWixEvent}
              isAdmin={isAdmin}
              userRSVPStatus={userRSVPStatus || null}
              isPastEvent={isPastEvent}
              canAddGuests={canAddGuests}
              waitlistEnabled={event.waitlist_enabled}
              waitlistCount={rsvpData.waitlistCount}
              waitlistCapacity={event.waitlist_capacity}
              isFeatured={event.is_featured}
              currentGuests={guests}
              importedRsvpCount={event.imported_rsvp_count}
              onRSVP={handleRSVP}
              onCancelRSVP={() => onCancelRSVP(event.id)}
              onEdit={() => setShowEditDialog(true)}
              onDelete={handleDelete}
              onViewDetails={() => setShowDetailsDialog(true)}
            />
          </EventCardWrapper>

          <EventDialogs
            event={event}
            showDetailsDialog={showDetailsDialog}
            setShowDetailsDialog={setShowDetailsDialog}
            showEditDialog={showEditDialog}
            setShowEditDialog={setShowEditDialog}
            rsvpCount={rsvpData.confirmedCount}
            attendeeNames={attendeeNames}
            waitlistedNames={waitlistedNames}
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
    </EventRSVPHandler>
  );
}
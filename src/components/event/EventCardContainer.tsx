import { Event } from "@/types/event";
import { EventCardWrapper } from "./EventCardWrapper";
import { EventCardHeader } from "./EventCardHeader";
import { EventCardContent } from "./card/EventCardContent";
import { EventDialogs } from "./dialogs/EventDialogs";
import { useEventCard } from "@/hooks/useEventCard";
import { useEventDialogs } from "@/hooks/useEventDialogs";
import { useAuthState } from "@/hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

  const {
    showEditDialog,
    setShowEditDialog,
    showDetailsDialog,
    setShowDetailsDialog
  } = useEventDialogs();

  const { isAuthenticated, profile } = useAuthState();
  const navigate = useNavigate();

  const isPastEvent = new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));
  const isWixEvent = event.description === 'Imported from Wix';
  const canAddGuests = isAdmin || userRSVPStatus === 'attending';

  const attendeeNames = attendees.map(attendee => {
    const fullName = attendee.profile.full_name;
    const firstName = fullName ? fullName.split(' ')[0] : attendee.profile.username;
    return firstName;
  });

  const handleRSVP = (guests?: { firstName: string }[]) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to RSVP for events");
      navigate("/auth");
      return;
    }

    if (!profile?.is_approved) {
      toast.error("Your account needs to be approved before you can RSVP for events");
      return;
    }

    onRSVP(event.id, guests);
  };

  const handleInteraction = (e: React.KeyboardEvent | React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]') ||
      target.closest('[data-interactive="true"]')
    ) {
      return;
    }

    setShowDetailsDialog(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleInteraction(e);
    }
  };

  return (
    <>
      <EventCardWrapper
        title={event.title}
        onInteraction={handleInteraction}
        onKeyDown={handleKeyDown}
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
  );
}
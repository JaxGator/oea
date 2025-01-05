import { Card } from "@/components/ui/card";
import { Event } from "@/types/event";
import { EventCardHeader } from "./event/EventCardHeader";
import { EventCardContent } from "./event/card/EventCardContent";
import { EventDialogs } from "./event/dialogs/EventDialogs";
import { useEventCard } from "@/hooks/useEventCard";
import { useEventDialogs } from "@/hooks/useEventDialogs";
import { useAuthState } from "@/hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface EventCardProps {
  event: Event;
  onRSVP: (eventId: string, guests?: { firstName: string }[]) => void;
  onCancelRSVP: (eventId: string) => void;
  userRSVPStatus?: string | null;
  onUpdate?: () => void;
}

export function EventCard({ 
  event, 
  onRSVP, 
  onCancelRSVP, 
  userRSVPStatus, 
  onUpdate 
}: EventCardProps) {
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
    // Prevent event bubbling for interactive elements
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
      <Card 
        className="w-full transition-all duration-300 hover:shadow-lg animate-fade-in bg-white cursor-pointer"
        onClick={handleInteraction}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${event.title}`}
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
      </Card>

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
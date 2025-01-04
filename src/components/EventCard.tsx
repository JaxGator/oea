import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Event } from "@/types/event";
import { EventCardHeader } from "./event/EventCardHeader";
import { EventCardBasicInfo } from "./event/card/EventCardBasicInfo";
import { EventCardDetailedView } from "./event/card/EventCardDetailedView";
import { EventEditDialog } from "./event/EventEditDialog";
import { EventActions } from "./event/actions/EventActions";
import { useEventCard } from "@/hooks/useEventCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
    showEditDialog,
    setShowEditDialog,
    isAdmin,
    rsvpCount,
    attendees,
    handleEditSuccess,
    handleDelete,
    showDetailsDialog,
    setShowDetailsDialog
  } = useEventCard(event.id, onUpdate);

  const { user, profile, isAuthenticated } = useAuthState();
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setShowDetailsDialog(true);
    }
  };

  return (
    <>
      <Card 
        className="w-full transition-all duration-300 hover:shadow-lg animate-fade-in bg-white cursor-pointer"
        onClick={() => setShowDetailsDialog(true)}
        onKeyDown={handleKeyPress}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${event.title}`}
      >
        <EventCardHeader imageUrl={event.image_url} title={event.title} />
        
        <CardContent className="p-4">
          <EventCardBasicInfo
            date={event.date}
            location={event.location}
            rsvpCount={rsvpCount}
            maxGuests={event.max_guests}
            isWixEvent={isWixEvent}
          />
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <EventActions
            isAdmin={isAdmin}
            userRSVPStatus={userRSVPStatus || null}
            isFullyBooked={rsvpCount >= event.max_guests}
            onRSVP={handleRSVP}
            onCancelRSVP={() => onCancelRSVP(event.id)}
            onEdit={() => setShowEditDialog(true)}
            onDelete={handleDelete}
            isPastEvent={isPastEvent}
            isWixEvent={isWixEvent}
            showDelete={isAdmin && (isPastEvent || isWixEvent)}
            canAddGuests={canAddGuests}
          />
        </CardFooter>
      </Card>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <EventCardDetailedView
            event={event}
            rsvpCount={rsvpCount}
            attendeeNames={attendeeNames}
            userRSVPStatus={userRSVPStatus || null}
            isAdmin={isAdmin}
            isPastEvent={isPastEvent}
            isWixEvent={isWixEvent}
            canAddGuests={canAddGuests}
            onRSVP={handleRSVP}
            onCancelRSVP={() => onCancelRSVP(event.id)}
            onEdit={() => setShowEditDialog(true)}
            onDelete={handleDelete}
          />
        </DialogContent>
      </Dialog>

      <EventEditDialog
        event={event}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
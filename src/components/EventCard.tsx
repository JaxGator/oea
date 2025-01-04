import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Event } from "@/types/event";
import { EventCardHeader } from "./event/EventCardHeader";
import { EventCardBasicInfo } from "./event/card/EventCardBasicInfo";
import { EventCardDetailedView } from "./event/card/EventCardDetailedView";
import { EventEditDialog } from "./event/EventEditDialog";
import { useEventCard } from "@/hooks/useEventCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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

  const isPastEvent = new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));
  const isWixEvent = event.description === 'Imported from Wix';
  const canAddGuests = isAdmin || userRSVPStatus === 'attending';

  const attendeeNames = attendees.map(attendee => {
    const fullName = attendee.profile.full_name;
    const firstName = fullName ? fullName.split(' ')[0] : attendee.profile.username;
    return firstName;
  });

  return (
    <>
      <Card 
        className="w-full transition-all duration-300 hover:shadow-lg animate-fade-in bg-white cursor-pointer"
        onClick={() => setShowDetailsDialog(true)}
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
            onRSVP={(guests) => onRSVP(event.id, guests)}
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
            onRSVP={(guests) => onRSVP(event.id, guests)}
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
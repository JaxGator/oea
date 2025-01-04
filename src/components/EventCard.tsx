import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Event } from "@/types/event";
import { EventDetails } from "./event/EventDetails";
import { EventActions } from "./event/EventActions";
import { AddToCalendar } from "./event/AddToCalendar";
import { EventCardHeader } from "./event/EventCardHeader";
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

export function EventCard({ event, onRSVP, onCancelRSVP, userRSVPStatus, onUpdate }: EventCardProps) {
  const { 
    showEditDialog,
    setShowEditDialog,
    isAdmin,
    rsvpCount,
    attendees,
    handleEditSuccess,
    handleCardClick,
    handleDelete,
    showDetailsDialog,
    setShowDetailsDialog
  } = useEventCard(event.id, onUpdate);

  const isFullyBooked = rsvpCount >= event.max_guests;
  const isPastEvent = new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));
  const isWixEvent = event.description === 'Imported from Wix';
  const disableRSVP = isPastEvent || (isPastEvent && isWixEvent);
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
        
        <CardContent className="p-4" data-interactive="true">
          <EventDetails
            date={event.date}
            time={event.time}
            location={event.location}
            rsvpCount={rsvpCount}
            maxGuests={event.max_guests}
            description={event.description || ""}
            attendeeNames={attendeeNames}
            userRSVPStatus={userRSVPStatus}
          />
          {(userRSVPStatus === 'attending' || isAdmin) && !disableRSVP && (
            <AddToCalendar
              event={{
                title: event.title,
                description: event.description,
                date: event.date,
                time: event.time,
                location: event.location,
              }}
            />
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0" data-interactive="true">
          <EventActions
            isAdmin={isAdmin}
            userRSVPStatus={userRSVPStatus || null}
            isFullyBooked={isFullyBooked}
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
          <div className="relative w-full aspect-video mb-4">
            <img
              src={event.image_url}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          </div>
          
          <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
          
          <EventDetails
            date={event.date}
            time={event.time}
            location={event.location}
            rsvpCount={rsvpCount}
            maxGuests={event.max_guests}
            description={event.description || ""}
            attendeeNames={attendeeNames}
            userRSVPStatus={userRSVPStatus}
            showFullDescription
          />
          
          <div className="mt-6">
            <EventActions
              isAdmin={isAdmin}
              userRSVPStatus={userRSVPStatus || null}
              isFullyBooked={isFullyBooked}
              onRSVP={(guests) => onRSVP(event.id, guests)}
              onCancelRSVP={() => onCancelRSVP(event.id)}
              onEdit={() => setShowEditDialog(true)}
              onDelete={handleDelete}
              isPastEvent={isPastEvent}
              isWixEvent={isWixEvent}
              showDelete={isAdmin && (isPastEvent || isWixEvent)}
              canAddGuests={canAddGuests}
            />
          </div>
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
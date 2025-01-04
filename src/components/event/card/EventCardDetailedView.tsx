import { format, parseISO } from "date-fns";
import { EventDetails } from "../EventDetails";
import { EventActions } from "../EventActions";
import { AddToCalendar } from "../AddToCalendar";

interface EventCardDetailedViewProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    max_guests: number;
    image_url: string;
  };
  rsvpCount: number;
  attendeeNames: string[];
  userRSVPStatus: string | null;
  isAdmin: boolean;
  isPastEvent: boolean;
  isWixEvent: boolean;
  canAddGuests: boolean;
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function EventCardDetailedView({
  event,
  rsvpCount,
  attendeeNames,
  userRSVPStatus,
  isAdmin,
  isPastEvent,
  isWixEvent,
  canAddGuests,
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete
}: EventCardDetailedViewProps) {
  const disableRSVP = isPastEvent || (isPastEvent && isWixEvent);
  const isFullyBooked = rsvpCount >= event.max_guests;

  return (
    <>
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

      <div className="mt-6">
        <EventActions
          isAdmin={isAdmin}
          userRSVPStatus={userRSVPStatus}
          isFullyBooked={isFullyBooked}
          onRSVP={onRSVP}
          onCancelRSVP={onCancelRSVP}
          onEdit={onEdit}
          onDelete={onDelete}
          isPastEvent={isPastEvent}
          isWixEvent={isWixEvent}
          showDelete={isAdmin && (isPastEvent || isWixEvent)}
          canAddGuests={canAddGuests}
        />
      </div>
    </>
  );
}
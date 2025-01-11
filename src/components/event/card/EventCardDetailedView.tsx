import { format, parseISO } from "date-fns";
import { EventDetails } from "../EventDetails";
import { EventActions } from "../EventActions";
import { AddToCalendar } from "../AddToCalendar";
import { EventShareMenu } from "../share/EventShareMenu";

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
  waitlistedNames: string[];
  userRSVPStatus: string | null;
  isAdmin: boolean;
  isPastEvent: boolean;
  isWixEvent: boolean;
  canAddGuests: boolean;
  currentGuests?: { firstName: string }[];
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function EventCardDetailedView({
  event,
  rsvpCount,
  attendeeNames,
  waitlistedNames,
  userRSVPStatus,
  isAdmin,
  isPastEvent,
  isWixEvent,
  canAddGuests,
  currentGuests = [],
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete
}: EventCardDetailedViewProps) {
  const disableRSVP = isPastEvent || (isPastEvent && isWixEvent);
  const isFullyBooked = rsvpCount >= event.max_guests;
  const canAddToCalendar = userRSVPStatus === 'attending' || isAdmin;

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 space-y-6">
        <div className="relative w-full aspect-video">
          <img
            src={event.image_url}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
        </div>
        
        <h2 className="text-2xl font-bold">{event.title}</h2>
        
        <EventDetails
          date={event.date}
          time={event.time}
          location={event.location}
          rsvpCount={rsvpCount}
          maxGuests={event.max_guests}
          description={event.description || ""}
          attendeeNames={attendeeNames}
          waitlistedNames={waitlistedNames}
          userRSVPStatus={userRSVPStatus}
          showFullDescription
        />
        
        {canAddToCalendar && !disableRSVP && (
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
      </div>

      <div className="sticky bottom-0 bg-white py-4 border-t mt-6">
        <div className="flex flex-wrap items-center gap-2">
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
            currentGuests={currentGuests}
          />
          <EventShareMenu eventId={event.id} title={event.title} />
        </div>
      </div>
    </div>
  );
}
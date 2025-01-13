import { Event } from "@/types/event";
import { EventCardBasicInfo } from "./EventCardBasicInfo";
import { EventMetadata } from "./EventMetadata";
import { EventActions } from "../actions/EventActions";
import { EventMap } from "../details/EventMap";
import { AttendeeList } from "../details/AttendeeList";
import { LocationDisplay } from "../details/LocationDisplay";
import { WaitlistInfo } from "./WaitlistInfo";
import { cn } from "@/lib/utils";

interface EventCardDetailedViewProps {
  event: Event;
  rsvpCount?: number;
  attendeeNames?: string[];
  userRSVPStatus: string | null;
  isAdmin: boolean;
  isPastEvent: boolean;
  isWixEvent: boolean;
  canAddGuests: boolean;
  currentGuests?: { firstName: string }[];
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function EventCardDetailedView({
  event,
  rsvpCount = 0,
  attendeeNames = [],
  userRSVPStatus,
  isAdmin,
  isPastEvent,
  isWixEvent,
  canAddGuests,
  currentGuests = [],
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
}: EventCardDetailedViewProps) {
  const isFullyBooked = rsvpCount >= event.max_guests;
  const canJoinWaitlist = event.waitlist_enabled && isFullyBooked;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="aspect-video relative rounded-t-lg overflow-hidden">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-6 space-y-6">
        <EventCardBasicInfo event={event} />
        
        <div className="space-y-4">
          <LocationDisplay location={event.location} showLocation={true} />
          <EventMetadata
            event={event}
            canAddToCalendar={!isPastEvent}
            isPastEvent={isPastEvent}
            rsvpCount={rsvpCount}
            maxGuests={event.max_guests}
            attendeeNames={attendeeNames}
          />
        </div>

        {event.description && (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: event.description }} />
          </div>
        )}

        <div className={cn(
          "flex flex-wrap items-center gap-4",
          "shadow-sm rounded-lg bg-white p-4"
        )}>
          <EventActions
            isAdmin={isAdmin}
            userRSVPStatus={userRSVPStatus}
            isFullyBooked={isFullyBooked}
            canJoinWaitlist={canJoinWaitlist}
            onRSVP={onRSVP}
            onCancelRSVP={onCancelRSVP}
            onEdit={onEdit}
            onDelete={onDelete}
            isPastEvent={isPastEvent}
            isWixEvent={isWixEvent}
            isPublished={event.is_published}
            canAddGuests={canAddGuests}
            currentGuests={currentGuests}
          />
        </div>

        {event.waitlist_enabled && (
          <WaitlistInfo
            isEnabled={event.waitlist_enabled}
            capacity={event.waitlist_capacity || 0}
            currentCount={0}
          />
        )}

        <AttendeeList
          count={rsvpCount}
          names={attendeeNames}
          maxCount={event.max_guests}
        />
      </div>
    </div>
  );
}
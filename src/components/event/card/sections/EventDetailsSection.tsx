import { LocationDisplay } from "../../details/LocationDisplay";
import { EventMetadata } from "../EventMetadata";
import { Event } from "@/types/event";

interface EventDetailsSectionProps {
  event: Event;
  rsvpCount: number;
  maxGuests: number;
  attendeeNames: string[];
  isPastEvent: boolean;
}

export function EventDetailsSection({
  event,
  rsvpCount,
  maxGuests,
  attendeeNames,
  isPastEvent
}: EventDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <LocationDisplay location={event.location} showLocation={true} />
      <EventMetadata
        event={event}
        canAddToCalendar={!isPastEvent}
        isPastEvent={isPastEvent}
        rsvpCount={rsvpCount}
        maxGuests={maxGuests}
        attendeeNames={attendeeNames}
      />
    </div>
  );
}
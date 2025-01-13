import { LocationDisplay } from "../../details/LocationDisplay";
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
      <div className="text-sm text-gray-600">
        <p>{new Date(event.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</p>
        <p>{event.time}</p>
      </div>
    </div>
  );
}
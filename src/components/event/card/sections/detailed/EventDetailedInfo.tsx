
import { Event } from "@/types/event";
import { EventCardBasicInfo } from "../../EventCardBasicInfo";

interface EventDetailedInfoProps {
  event: Event;
  rsvpCount: number;
  isPastEvent: boolean;
  isWixEvent: boolean;
}

export function EventDetailedInfo({ 
  event, 
  rsvpCount, 
  isPastEvent, 
  isWixEvent 
}: EventDetailedInfoProps) {
  return (
    <EventCardBasicInfo
      date={event.date}
      time={event.time || '00:00:00'}
      location={event.location}
      rsvpCount={rsvpCount}
      maxGuests={event.max_guests}
      isWixEvent={isWixEvent}
      waitlistEnabled={event.waitlist_enabled}
      waitlistCapacity={event.waitlist_capacity}
      importedRsvpCount={event.imported_rsvp_count}
      isPastEvent={isPastEvent}
    />
  );
}

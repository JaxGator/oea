
import { Event } from "@/types/event";
import { EventLocationMap } from "./details/EventLocationMap";
import { useEventLocations } from "@/hooks/useEventLocations";
import { Skeleton } from "@/components/ui/skeleton";
import { AttendeeList } from "./details/AttendeeList";

interface EventDetailsProps {
  event: Event;
}

export function EventDetails({ event }: EventDetailsProps) {
  // Get location data if available
  const locations = useEventLocations([event]);
  const location = locations?.[0];
  
  // Only try to display attendees if they exist in the event object
  const attendeeNames = event.rsvps
    ?.filter(rsvp => rsvp.response === 'attending' && rsvp.status === 'confirmed')
    .map(rsvp => ({
      name: rsvp.profiles?.username || 'Unknown',
      guests: rsvp.event_guests?.map(guest => guest.first_name) || []
    }))
    .flatMap(({name, guests}) => [
      name,
      ...guests.map(guestName => `${guestName} (Guest of ${name})`)
    ]) || [];

  console.log("EventDetails - Event data:", event);
  console.log("EventDetails - Location data:", location);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Location</h3>
        <p className="text-gray-600">{event.location}</p>
        
        {location ? (
          <div className="h-[200px] rounded-lg overflow-hidden">
            <EventLocationMap 
              location={event.location}
              lat={location.lat}
              lng={location.lng}
            />
          </div>
        ) : (
          <div className="h-[200px] rounded-lg bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Location map not available</p>
          </div>
        )}
      </div>
      
      {attendeeNames.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Attendees</h3>
          <AttendeeList
            attendeeNames={attendeeNames}
          />
        </div>
      )}
    </div>
  );
}

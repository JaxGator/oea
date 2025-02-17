
import { Event } from "@/types/event";
import { EventLocationMap } from "./details/EventLocationMap";
import { useEventLocations } from "@/hooks/useEventLocations";
import { useMapboxToken } from "@/hooks/useMapboxToken";
import { Skeleton } from "@/components/ui/skeleton";
import { AttendeeList } from "./details/AttendeeList";
import { format } from "date-fns";

interface EventDetailsProps {
  event: Event;
}

export function EventDetails({ event }: EventDetailsProps) {
  const { mapToken, isLoading: isTokenLoading, error: tokenError } = useMapboxToken();
  const locations = useEventLocations([event]);
  const location = locations?.[0];

  const attendeeNames = event.rsvps
    ?.filter(rsvp => rsvp.response === 'attending' && rsvp.status === 'confirmed')
    .map(rsvp => ({
      name: rsvp.profiles?.full_name || rsvp.profiles?.username || 'Unknown',
      guests: rsvp.event_guests?.map(guest => guest.first_name) || []
    }))
    .flatMap(({name, guests}) => [
      name,
      ...guests.map(guestName => `${guestName} (Guest of ${name})`)
    ]) || [];

  console.log('EventDetails - Attendees:', attendeeNames);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Event Details</h2>
        <p className="text-gray-600">
          {format(new Date(`${event.date} ${event.time}`), 'PPp')}
        </p>
        <p className="text-gray-600">{event.location}</p>
      </div>

      {event.description && (
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: event.description }} />
        </div>
      )}

      {isTokenLoading ? (
        <Skeleton className="h-[200px] w-full rounded-lg" />
      ) : tokenError ? (
        <div className="h-[200px] rounded-lg bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Unable to load map</p>
        </div>
      ) : !location ? (
        <div className="h-[200px] rounded-lg bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Location not available on map</p>
        </div>
      ) : (
        <div className="h-[200px] rounded-lg overflow-hidden">
          <EventLocationMap 
            location={event.location}
            lat={location.lat}
            lng={location.lng}
          />
        </div>
      )}

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Attendees</h2>
        <AttendeeList 
          attendeeNames={attendeeNames}
          waitlistNames={event.rsvps
            ?.filter(rsvp => rsvp.status === 'waitlisted')
            .map(rsvp => rsvp.profiles?.full_name || rsvp.profiles?.username || 'Unknown')
            || []}
        />
      </div>
    </div>
  );
}

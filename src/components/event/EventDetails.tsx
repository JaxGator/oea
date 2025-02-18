
import { Event } from "@/types/event";
import { EventLocationMap } from "./details/EventLocationMap";
import { useEventLocations } from "@/hooks/useEventLocations";
import { useMapboxToken } from "@/hooks/useMapboxToken";
import { Skeleton } from "@/components/ui/skeleton";
import { AttendeeList } from "./details/AttendeeList";

interface EventDetailsProps {
  event: Event;
}

export function EventDetails({ event }: EventDetailsProps) {
  // Move all hooks to the top level - they must be called in the same order on every render
  const { mapToken, isLoading: isTokenLoading, error: tokenError } = useMapboxToken();
  const locations = useEventLocations([event]);
  const location = locations?.[0];

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

  // Render function to handle the loading state
  const renderLoadingState = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Location</h3>
        <p className="text-gray-600">{event.location}</p>
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </div>
    </div>
  );

  // Render function to handle the error state
  const renderErrorState = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Location</h3>
        <p className="text-gray-600">{event.location}</p>
        <div className="h-[200px] rounded-lg bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Unable to load map</p>
        </div>
      </div>
    </div>
  );

  // Render function to handle missing location
  const renderNoLocationState = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Location</h3>
        <p className="text-gray-600">{event.location}</p>
        <div className="h-[200px] rounded-lg bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Location not available on map</p>
        </div>
      </div>
    </div>
  );

  // Render function for the map
  const renderMap = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Location</h3>
        <p className="text-gray-600">{event.location}</p>
        <div className="h-[200px] rounded-lg overflow-hidden">
          {location && (
            <EventLocationMap 
              location={event.location}
              lat={location.lat}
              lng={location.lng}
            />
          )}
        </div>
      </div>
    </div>
  );

  // Determine which render function to use based on state
  if (isTokenLoading) {
    return renderLoadingState();
  }

  if (tokenError) {
    console.error('Error loading map token:', tokenError);
    return renderErrorState();
  }

  if (!location) {
    return renderNoLocationState();
  }

  return renderMap();
}

import { Event } from "@/types/event";
import { EventLocationMap } from "./details/EventLocationMap";
import { useEventLocations } from "@/hooks/useEventLocations";
import { useGoogleMapsToken } from "@/hooks/useGoogleMapsToken";

interface EventDetailsProps {
  event: Event;
}

export function EventDetails({ event }: EventDetailsProps) {
  const { mapKey } = useGoogleMapsToken();
  const locations = useEventLocations([event], mapKey);
  const location = locations[0];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Location</h3>
        <p className="text-gray-600">{event.location}</p>
        <EventLocationMap 
          location={event.location}
          lat={location?.lat}
          lng={location?.lng}
        />
      </div>
    </div>
  );
}
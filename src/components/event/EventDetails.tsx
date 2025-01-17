import { Event } from "@/types/event";
import { EventLocationMap } from "./details/EventLocationMap";
import { useEventLocations } from "@/hooks/useEventLocations";
import { useMapboxToken } from "@/hooks/useMapboxToken";
import { Skeleton } from "@/components/ui/skeleton";

interface EventDetailsProps {
  event: Event;
}

export function EventDetails({ event }: EventDetailsProps) {
  const { mapToken, isLoading: isTokenLoading, error: tokenError } = useMapboxToken();
  const locations = useEventLocations([event], mapToken);
  const location = locations[0];

  if (isTokenLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Location</h3>
          <p className="text-gray-600">{event.location}</p>
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (tokenError) {
    console.error('Error loading map token:', tokenError);
    return (
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
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Location</h3>
        <p className="text-gray-600">{event.location}</p>
        <div className="h-[200px] rounded-lg overflow-hidden">
          <EventLocationMap 
            location={event.location}
            lat={location?.lat}
            lng={location?.lng}
          />
        </div>
      </div>
    </div>
  );
}
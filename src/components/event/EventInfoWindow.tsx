import { InfoWindow } from '@react-google-maps/api';
import { Event } from '@/types/event';
import { Location } from '@/hooks/useEventLocations';

interface EventInfoWindowProps {
  event: Event;
  locations: Location[];
  onClose: () => void;
}

export function EventInfoWindow({ event, locations, onClose }: EventInfoWindowProps) {
  const position = locations.find(loc => loc.event.id === event.id) || locations[0];

  return (
    <InfoWindow position={position} onCloseClick={onClose}>
      <div className="p-2">
        <h3 className="font-semibold">{event.title}</h3>
        <p className="text-sm">
          {event.date} at {event.time}<br />
          {event.location}
        </p>
      </div>
    </InfoWindow>
  );
}
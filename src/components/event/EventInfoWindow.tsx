import { InfoWindow } from '@react-google-maps/api';
import { Event } from '@/types/event';
import { Location } from '@/hooks/useEventLocations';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface EventInfoWindowProps {
  event: Event;
  locations: Location[];
  onClose: () => void;
}

export function EventInfoWindow({ event, locations, onClose }: EventInfoWindowProps) {
  const position = locations.find(loc => loc.event.id === event.id) || locations[0];

  const handleGetDirections = () => {
    const destination = encodeURIComponent(event.location);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
  };

  return (
    <InfoWindow position={position} onCloseClick={onClose}>
      <div className="p-2 min-w-[200px]">
        <h3 className="font-semibold mb-2">{event.title}</h3>
        <p className="text-sm mb-3">
          {event.date} at {event.time}<br />
          {event.location}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={handleGetDirections}
        >
          <MapPin className="mr-2 h-4 w-4" />
          Get Directions
        </Button>
      </div>
    </InfoWindow>
  );
}
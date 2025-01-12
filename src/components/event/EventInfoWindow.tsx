import { InfoWindow } from '@react-google-maps/api';
import { Event } from '@/types/event';
import { Location } from '@/hooks/useEventLocations';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

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
      <div className="p-4 min-w-[250px]">
        <h3 className="font-semibold mb-2">{event.title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
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
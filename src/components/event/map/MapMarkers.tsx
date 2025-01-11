import { Marker } from '@react-google-maps/api';
import { Event } from '@/types/event';
import { Location } from '@/hooks/useEventLocations';

interface MapMarkersProps {
  locations: Location[];
  selectedEventId?: string | null;
  onMarkerClick: (event: Event) => void;
}

export const MapMarkers = ({ locations, selectedEventId, onMarkerClick }: MapMarkersProps) => (
  <>
    {locations.map((location) => (
      <Marker
        key={location.event.id}
        position={location}
        onClick={() => onMarkerClick(location.event)}
        animation={
          selectedEventId === location.event.id 
            ? 1 // BOUNCE animation
            : undefined
        }
      />
    ))}
  </>
);
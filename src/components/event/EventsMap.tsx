import { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Event } from '@/types/event';
import { useGoogleMapsToken } from '@/hooks/useGoogleMapsToken';
import { useEventLocations } from '@/hooks/useEventLocations';
import { EventInfoWindow } from './EventInfoWindow';

interface EventsMapProps {
  events: Event[];
  selectedEventId?: string | null;
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

export function EventsMap({ events, selectedEventId }: EventsMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { mapKey, isLoading, error } = useGoogleMapsToken();
  const locations = useEventLocations(events, mapKey);
  const [mapLoaded, setMapLoaded] = useState(false);

  if (isLoading || error || locations.length === 0) {
    return null;
  }

  // Find the selected location
  const selectedLocation = selectedEventId 
    ? locations.find(loc => loc.event.id === selectedEventId)
    : null;

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  // Center map on selected event or default to first location
  const center = selectedLocation || locations[0];

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8">
      <LoadScript 
        googleMapsApiKey={mapKey}
        libraries={libraries}
        onLoad={() => setMapLoaded(true)}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={selectedLocation ? 14 : 12}
          center={center}
          options={{
            styles: [
              {
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ lightness: 20 }],
              },
            ],
          }}
        >
          {mapLoaded && locations.map((location) => (
            <Marker
              key={location.event.id}
              position={location}
              onClick={() => setSelectedEvent(location.event)}
              animation={location.event.id === selectedEventId ? window.google?.maps.Animation.BOUNCE : undefined}
            />
          ))}

          {mapLoaded && selectedEvent && (
            <EventInfoWindow
              event={selectedEvent}
              locations={locations}
              onClose={() => setSelectedEvent(null)}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
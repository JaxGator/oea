import { useState, useCallback } from 'react';
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
  const { mapKey, isLoading: isKeyLoading } = useGoogleMapsToken();
  const locations = useEventLocations(events, mapKey);
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

  const handleUnmount = useCallback(() => {
    setMapLoaded(false);
  }, []);

  // Don't render anything if there are no events or locations
  if (events.length === 0 || locations.length === 0) {
    return null;
  }

  // Show loading state only when fetching the API key
  if (isKeyLoading) {
    return (
      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg mb-8 bg-gray-100 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If we have no API key, don't show anything
  if (!mapKey) {
    return null;
  }

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  // Find the selected location
  const selectedLocation = selectedEventId 
    ? locations.find(loc => loc.event.id === selectedEventId)
    : null;

  // Center map on selected event or default to first location
  const center = selectedLocation || locations[0];

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8">
      <LoadScript 
        googleMapsApiKey={mapKey}
        libraries={libraries}
        onLoad={handleLoad}
        onUnmount={handleUnmount}
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
              animation={
                selectedEventId === location.event.id 
                  ? 1 // BOUNCE animation
                  : undefined
              }
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
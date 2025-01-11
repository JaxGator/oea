import { useState, useCallback, useMemo } from 'react';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
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
  const { mapKey, isLoading: isKeyLoading, error: keyError } = useGoogleMapsToken();
  const locations = useEventLocations(events, mapKey);

  // Use useLoadScript hook instead of LoadScript component
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: mapKey || '',
    libraries,
  });

  // Memoize the map options
  const mapOptions = useMemo(() => ({
    styles: [
      {
        featureType: 'all',
        elementType: 'geometry',
        stylers: [{ lightness: 20 }],
      },
    ],
  }), []);

  // Memoize the center location
  const center = useMemo(() => {
    const selectedLocation = selectedEventId 
      ? locations.find(loc => loc.event.id === selectedEventId)
      : null;
    return selectedLocation || locations[0];
  }, [selectedEventId, locations]);

  const handleMarkerClick = useCallback((event: Event) => {
    setSelectedEvent(event);
  }, []);

  // Don't render anything if there are no events or locations
  if (events.length === 0 || locations.length === 0) {
    return null;
  }

  // Show loading state when fetching the API key
  if (isKeyLoading) {
    return (
      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg mb-8 bg-gray-100 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Show error state if there's an API key error
  if (keyError || !mapKey) {
    return (
      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg mb-8 bg-red-50 flex items-center justify-center">
        <div className="text-red-600">Failed to load map configuration</div>
      </div>
    );
  }

  // Show error state if there's a script loading error
  if (loadError) {
    return (
      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg mb-8 bg-red-50 flex items-center justify-center">
        <div className="text-red-600">Error loading map</div>
      </div>
    );
  }

  // Show loading state while the script is loading
  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg mb-8 bg-gray-100 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8">
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '400px',
        }}
        zoom={selectedEventId ? 14 : 12}
        center={center}
        options={mapOptions}
      >
        {locations.map((location) => (
          <Marker
            key={location.event.id}
            position={location}
            onClick={() => handleMarkerClick(location.event)}
            animation={
              selectedEventId === location.event.id 
                ? 1 // BOUNCE animation
                : undefined
            }
          />
        ))}

        {selectedEvent && (
          <EventInfoWindow
            event={selectedEvent}
            locations={locations}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </GoogleMap>
    </div>
  );
}
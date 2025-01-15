import { useState, useCallback, useMemo } from 'react';
import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import { Event } from '@/types/event';
import { useGoogleMapsToken } from '@/hooks/useGoogleMapsToken';
import { useEventLocations } from '@/hooks/useEventLocations';
import { EventInfoWindow } from './EventInfoWindow';
import { MapLoadingState } from './map/MapLoadingState';
import { MapErrorState } from './map/MapErrorState';
import { MapMarkers } from './map/MapMarkers';

interface EventsMapProps {
  events: Event[];
  selectedEventId?: string | null;
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

export function EventsMap({ events, selectedEventId }: EventsMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { mapKey, isLoading: isKeyLoading, error: keyError } = useGoogleMapsToken();
  const locations = useEventLocations(events, mapKey);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: mapKey || '',
    libraries,
  });

  const mapOptions = useMemo(() => ({
    styles: [
      {
        featureType: 'all',
        elementType: 'geometry',
        stylers: [{ lightness: 20 }],
      },
    ],
  }), []);

  // Find the selected location based on selectedEventId
  const selectedLocation = useMemo(() => {
    if (!selectedEventId) return locations[0];
    return locations.find(loc => loc.event.id === selectedEventId) || locations[0];
  }, [selectedEventId, locations]);

  // Update map center when selectedLocation changes
  const center = useMemo(() => ({
    lat: selectedLocation?.lat || (locations[0]?.lat || 0),
    lng: selectedLocation?.lng || (locations[0]?.lng || 0),
  }), [selectedLocation, locations]);

  const handleMarkerClick = useCallback((event: Event) => {
    setSelectedEvent(event);
  }, []);

  if (events.length === 0 || locations.length === 0) {
    return null;
  }

  if (isKeyLoading) {
    return <MapLoadingState />;
  }

  if (keyError || !mapKey) {
    return <MapErrorState message="Failed to load map configuration" />;
  }

  if (loadError) {
    return <MapErrorState message="Error loading map" />;
  }

  if (!isLoaded) {
    return <MapLoadingState />;
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
        <MapMarkers 
          locations={locations}
          selectedEventId={selectedEventId}
          onMarkerClick={handleMarkerClick}
        />

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
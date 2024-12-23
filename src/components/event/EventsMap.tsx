import { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Event } from '@/types/event';
import { useGoogleMapsToken } from '@/hooks/useGoogleMapsToken';
import { useEventLocations } from '@/hooks/useEventLocations';
import { EventInfoWindow } from './EventInfoWindow';

interface EventsMapProps {
  events: Event[];
}

export function EventsMap({ events }: EventsMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { mapKey, isLoading, error } = useGoogleMapsToken();
  const locations = useEventLocations(events, mapKey);
  const mapRef = useRef<google.maps.Map>();

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    if (locations.length === 0) return;
    
    if (locations.length === 1) {
      map.setCenter(locations[0]);
      map.setZoom(12);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    locations.forEach(location => {
      bounds.extend({ lat: location.lat, lng: location.lng });
    });
    map.fitBounds(bounds);
  }, [locations]);

  if (isLoading || error || locations.length === 0) {
    return null;
  }

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const defaultCenter = locations[0] || { lat: 0, lng: 0 };

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8">
      <LoadScript googleMapsApiKey={mapKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={defaultCenter}
          onLoad={onMapLoad}
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
          {locations.map((location, index) => (
            <Marker
              key={index}
              position={location}
              onClick={() => setSelectedEvent(location.event)}
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
      </LoadScript>
    </div>
  );
}
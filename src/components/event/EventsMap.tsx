import { useState } from 'react';
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

  if (isLoading || error || locations.length === 0) {
    return null;
  }

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8">
      <LoadScript googleMapsApiKey={mapKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={locations[0]}
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
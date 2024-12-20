import React, { useCallback, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Event } from '@/types/event';
import { useAuthState } from '@/hooks/useAuthState';
import { EventMapError } from './map/EventMapError';
import { EventMapLoading } from './map/EventMapLoading';
import { EventInfoWindow } from './map/EventInfoWindow';
import { useGoogleMapsKey } from './map/useGoogleMapsKey';
import { useEventLocations } from './map/useEventLocations';

interface EventsMapProps {
  events: Event[];
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795, // Center of USA
};

export function EventsMap({ events }: EventsMapProps) {
  const { user, profile } = useAuthState();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const isEnabled = Boolean(user && profile?.is_approved);
  
  const { googleMapsKey, error: keyError } = useGoogleMapsKey(isEnabled);
  const { eventLocations, error: locationsError } = useEventLocations(events, googleMapsKey);

  const onLoad = useCallback((map: google.maps.Map) => {
    if (eventLocations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      eventLocations.forEach(({ position }) => {
        bounds.extend(position);
      });
      map.fitBounds(bounds);
    }
  }, [eventLocations]);

  // If user is not authenticated and approved, don't render the map
  if (!user || !profile?.is_approved) {
    return null;
  }

  if (keyError || locationsError) {
    return <EventMapError error={keyError || locationsError} />;
  }

  if (!googleMapsKey) {
    return <EventMapLoading />;
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg mb-8">
      <LoadScript googleMapsApiKey={googleMapsKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={4}
          onLoad={onLoad}
        >
          {eventLocations.map(({ event, position }) => (
            <Marker
              key={event.id}
              position={position}
              onClick={() => setSelectedEvent(event)}
            />
          ))}

          {selectedEvent && (
            <InfoWindow
              position={eventLocations.find(loc => loc.event.id === selectedEvent.id)?.position}
              onCloseClick={() => setSelectedEvent(null)}
            >
              <EventInfoWindow event={selectedEvent} />
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
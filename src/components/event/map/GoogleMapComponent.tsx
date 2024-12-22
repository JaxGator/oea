import React, { useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Event } from '@/types/event';
import { EventInfoWindow } from './EventInfoWindow';

interface GoogleMapComponentProps {
  googleMapsKey: string;
  eventLocations: Array<{ event: Event; position: google.maps.LatLngLiteral }>;
  selectedEvent: Event | null;
  onEventSelect: (event: Event | null) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795, // Center of USA
};

function GoogleMapComponent({ 
  googleMapsKey, 
  eventLocations, 
  selectedEvent, 
  onEventSelect 
}: GoogleMapComponentProps) {
  const onLoad = useCallback((map: google.maps.Map) => {
    if (eventLocations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      eventLocations.forEach(({ position }) => {
        // Additional validation before extending bounds
        if (position && typeof position.lat === 'number' && typeof position.lng === 'number') {
          bounds.extend(position);
        }
      });
      
      // Only fit bounds if we have valid locations
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
      } else {
        // If no valid bounds, center on default location
        map.setCenter(defaultCenter);
        map.setZoom(4);
      }
    } else {
      // If no locations, center on default location
      map.setCenter(defaultCenter);
      map.setZoom(4);
    }
  }, [eventLocations]);

  return (
    <LoadScript googleMapsApiKey={googleMapsKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={4}
        onLoad={onLoad}
      >
        {eventLocations.map(({ event, position }) => (
          position && typeof position.lat === 'number' && typeof position.lng === 'number' && (
            <Marker
              key={event.id}
              position={position}
              onClick={() => onEventSelect(event)}
            />
          )
        ))}

        {selectedEvent && (
          <InfoWindow
            position={eventLocations.find(loc => loc.event.id === selectedEvent.id)?.position}
            onCloseClick={() => onEventSelect(null)}
          >
            <EventInfoWindow event={selectedEvent} />
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default GoogleMapComponent;
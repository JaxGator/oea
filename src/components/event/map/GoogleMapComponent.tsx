import React, { useCallback, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Event } from '@/types/event';
import { EventInfoWindow } from './EventInfoWindow';
import { EventMapLoading } from './EventMapLoading';

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

// Memoize map options to prevent unnecessary re-renders
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

function GoogleMapComponent({ 
  googleMapsKey, 
  eventLocations, 
  selectedEvent, 
  onEventSelect 
}: GoogleMapComponentProps) {
  const mapRef = useRef<google.maps.Map>();

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    if (eventLocations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      eventLocations.forEach(({ position }) => {
        bounds.extend(position);
      });
      map.fitBounds(bounds);
    }
  }, [eventLocations]);

  // Update bounds when locations change
  useEffect(() => {
    if (mapRef.current && eventLocations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      eventLocations.forEach(({ position }) => {
        bounds.extend(position);
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [eventLocations]);

  return (
    <LoadScript 
      googleMapsApiKey={googleMapsKey}
      loadingElement={<EventMapLoading />}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={4}
        onLoad={onLoad}
        options={mapOptions}
      >
        {eventLocations.map(({ event, position }) => (
          <Marker
            key={event.id}
            position={position}
            onClick={() => onEventSelect(event)}
          />
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
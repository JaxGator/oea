import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Event } from '@/types/event';
import { supabase } from '@/integrations/supabase/client';

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
  const [googleMapsKey, setGoogleMapsKey] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventLocations, setEventLocations] = useState<Array<{ event: Event; position: google.maps.LatLngLiteral }>>([]);

  // Fetch Google Maps API key from Supabase Edge Function
  useEffect(() => {
    const fetchApiKey = async () => {
      const { data: { token }, error } = await supabase.functions.invoke('get-google-maps-token');
      if (error) {
        console.error('Error fetching Google Maps token:', error);
        return;
      }
      setGoogleMapsKey(token);
    };

    fetchApiKey();
  }, []);

  // Geocode addresses to coordinates
  useEffect(() => {
    const geocodeAddresses = async () => {
      if (!googleMapsKey) return;

      const locations = await Promise.all(
        events.map(async (event) => {
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                event.location
              )}&key=${googleMapsKey}`
            );
            const data = await response.json();

            if (data.results && data.results[0]) {
              const { lat, lng } = data.results[0].geometry.location;
              return {
                event,
                position: { lat, lng },
              };
            }
          } catch (error) {
            console.error('Error geocoding address:', error);
          }
          return null;
        })
      );

      setEventLocations(locations.filter((loc): loc is NonNullable<typeof loc> => loc !== null));
    };

    if (events.length > 0) {
      geocodeAddresses();
    }
  }, [events, googleMapsKey]);

  const onLoad = useCallback((map: google.maps.Map) => {
    if (eventLocations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      eventLocations.forEach(({ position }) => {
        bounds.extend(position);
      });
      map.fitBounds(bounds);
    }
  }, [eventLocations]);

  if (!googleMapsKey) return null;

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
              <div className="p-2">
                <h3 className="font-semibold">{selectedEvent.title}</h3>
                <p className="text-sm">{selectedEvent.location}</p>
                <p className="text-sm">{selectedEvent.date} at {selectedEvent.time}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
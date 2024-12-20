import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Event } from '@/types/event';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from '@/hooks/useAuthState';

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
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuthState();

  // If user is not authenticated and approved, don't render the map
  if (!user || !profile?.is_approved) {
    return null;
  }

  // Fetch Google Maps API key from Supabase Edge Function
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error: functionError } = await supabase.functions.invoke('get-google-maps-token');
        
        if (functionError) {
          console.error('Error fetching Google Maps token:', functionError);
          throw new Error('Failed to load map configuration. Please try again later.');
        }
        
        if (!data?.token) {
          throw new Error('Invalid map configuration received. Please contact support.');
        }

        setGoogleMapsKey(data.token);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load map configuration';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    };

    fetchApiKey();
  }, []);

  // Geocode addresses to coordinates
  useEffect(() => {
    const geocodeAddresses = async () => {
      if (!googleMapsKey || !events.length) return;

      try {
        const locations = await Promise.all(
          events.map(async (event) => {
            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                  event.location
                )}&key=${googleMapsKey}`
              );
              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.error_message || 'Geocoding request failed');
              }

              if (data.results && data.results[0]) {
                const { lat, lng } = data.results[0].geometry.location;
                return {
                  event,
                  position: { lat, lng },
                };
              }
              
              console.warn(`Could not geocode location for event: ${event.title}`);
              return null;
            } catch (error) {
              console.error('Error geocoding address:', error);
              return null;
            }
          })
        );

        setEventLocations(locations.filter((loc): loc is NonNullable<typeof loc> => loc !== null));
      } catch (err) {
        const errorMessage = 'Failed to load event locations on the map';
        setError(errorMessage);
        toast.error(errorMessage);
      }
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

  if (error) {
    return (
      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg mb-8 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Unable to load map: {error}</p>
      </div>
    );
  }

  if (!googleMapsKey) {
    return (
      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg mb-8 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
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
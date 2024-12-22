import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Event } from '@/types/event';
import { supabase } from '@/integrations/supabase/client';

interface EventsMapProps {
  events: Event[];
}

interface Location {
  lat: number;
  lng: number;
}

export function EventsMap({ events }: EventsMapProps) {
  const [locations, setLocations] = useState<(Location & { event: Event })[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [mapKey, setMapKey] = useState<string>('');

  useEffect(() => {
    const fetchGoogleMapsKey = async () => {
      const { data, error } = await supabase.functions.invoke('get-google-maps-token');
      if (error) {
        console.error('Error fetching Google Maps token:', error);
        return;
      }
      setMapKey(data.token);
    };

    const geocodeLocations = async () => {
      const validEvents = events.filter(event => 
        event.location && event.location.trim() !== ''
      );

      const geocodedLocations = await Promise.all(
        validEvents.map(async (event) => {
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(event.location)}&key=${mapKey}`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0) {
              const { lat, lng } = data.results[0].geometry.location;
              return { lat, lng, event };
            }
          } catch (error) {
            console.error('Error geocoding location:', error);
          }
          return null;
        })
      );

      setLocations(geocodedLocations.filter((loc): loc is Location & { event: Event } => loc !== null));
    };

    fetchGoogleMapsKey();
    if (mapKey && events.length > 0) {
      geocodeLocations();
    }
  }, [events, mapKey]);

  if (!mapKey || locations.length === 0) {
    return null;
  }

  const center = locations[0];
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
          {locations.map((location, index) => (
            <Marker
              key={index}
              position={location}
              onClick={() => setSelectedEvent(location.event)}
            />
          ))}

          {selectedEvent && (
            <InfoWindow
              position={locations.find(loc => loc.event.id === selectedEvent.id) || locations[0]}
              onCloseClick={() => setSelectedEvent(null)}
            >
              <div className="p-2">
                <h3 className="font-semibold">{selectedEvent.title}</h3>
                <p className="text-sm">
                  {selectedEvent.date} at {selectedEvent.time}<br />
                  {selectedEvent.location}
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
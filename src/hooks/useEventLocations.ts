import { useState, useEffect } from 'react';
import { Event } from '@/types/event';
import { toast } from 'sonner';

export interface Location {
  lat: number;
  lng: number;
  event: Event;
}

export const useEventLocations = (events: Event[], mapKey: string) => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const geocodeLocations = async () => {
      const validEvents = events.filter(event => 
        event.location && event.location.trim() !== ''
      );

      try {
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
              console.warn('No results found for location:', event.location);
              return null;
            } catch (error) {
              console.error('Error geocoding location:', error);
              return null;
            }
          })
        );

        setLocations(geocodedLocations.filter((loc): loc is Location => loc !== null));
      } catch (err) {
        console.error('Error in geocodeLocations:', err);
        toast.error('Failed to load event locations');
      }
    };

    if (mapKey && events.length > 0) {
      geocodeLocations();
    }
  }, [events, mapKey]);

  return locations;
};
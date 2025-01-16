import { useState, useEffect } from 'react';
import { Event } from '@/types/event';
import { toast } from 'sonner';

export interface Location {
  lat: number;
  lng: number;
  event: Event;
}

// Cache for geocoded locations
const geocodeCache: Record<string, { lat: number; lng: number }> = {};

export const useEventLocations = (events: Event[], mapToken: string) => {
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
              // Check cache first
              if (geocodeCache[event.location]) {
                const { lat, lng } = geocodeCache[event.location];
                return { lat, lng, event };
              }

              const query = encodeURIComponent(event.location);
              const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapToken}`
              );
              const data = await response.json();

              if (data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].center;
                // Cache the result
                geocodeCache[event.location] = { lat, lng };
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

    if (mapToken && events.length > 0) {
      geocodeLocations();
    }
  }, [events, mapToken]);

  return locations;
};
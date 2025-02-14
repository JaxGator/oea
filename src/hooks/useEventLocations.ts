
import { useEffect, useState } from 'react';
import { Event } from '@/types/event';
import { useMapboxToken } from './useMapboxToken';

export interface Location {
  lat: number;
  lng: number;
  event: Event;
}

export const useEventLocations = (events: Event[]): Location[] => {
  const [locations, setLocations] = useState<Location[]>([]);
  const { mapToken, isLoading } = useMapboxToken();

  useEffect(() => {
    if (!mapToken || isLoading || !events.length) return;

    const fetchCoordinates = async () => {
      const existingLocations = new Map(locations.map(loc => [loc.event.id, loc]));
      const newLocations: Location[] = [];
      let hasChanges = false;

      for (const event of events) {
        const existing = existingLocations.get(event.id);
        if (existing) {
          newLocations.push(existing);
          continue;
        }

        try {
          const encodedAddress = encodeURIComponent(event.location);
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${mapToken}`
          );
          const data = await response.json();

          if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            newLocations.push({ lat, lng, event });
            hasChanges = true;
          }
        } catch (error) {
          console.error(`Error geocoding location for event ${event.id}:`, error);
        }
      }

      if (hasChanges) {
        setLocations(newLocations);
      }
    };

    fetchCoordinates();
  }, [events, mapToken]); // Remove locations from dependencies

  return locations;
};

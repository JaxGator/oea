import { useState, useEffect } from 'react';
import { Event } from "@/types/event";
import { toast } from "sonner";

export function useEventLocations(events: Event[], googleMapsKey: string) {
  const [eventLocations, setEventLocations] = useState<Array<{ event: Event; position: google.maps.LatLngLiteral }>>([]);
  const [error, setError] = useState<string | null>(null);

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

    if (googleMapsKey && events.length > 0) {
      geocodeAddresses();
    }
  }, [events, googleMapsKey]);

  return { eventLocations, error };
}
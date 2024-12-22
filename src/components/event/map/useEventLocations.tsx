import { useState, useEffect, useCallback } from 'react';
import { Event } from "@/types/event";
import { toast } from "sonner";

interface Location {
  lat: number;
  lng: number;
}

export function useEventLocations(events: Event[], googleMapsKey: string) {
  const [eventLocations, setEventLocations] = useState<Array<{ event: Event; position: google.maps.LatLngLiteral }>>([]);
  const [error, setError] = useState<string | null>(null);

  // Validate coordinates
  const isValidCoordinates = (location: any): location is Location => {
    return (
      location &&
      typeof location.lat === 'number' &&
      typeof location.lng === 'number' &&
      !isNaN(location.lat) &&
      !isNaN(location.lng) &&
      location.lat >= -90 && 
      location.lat <= 90 &&
      location.lng >= -180 && 
      location.lng <= 180
    );
  };

  // Memoize the geocoding function
  const geocodeAddress = useCallback(async (event: Event) => {
    try {
      // Check if we already have the location cached in localStorage
      const cachedLocationStr = localStorage.getItem(`location_${event.location}`);
      if (cachedLocationStr) {
        const cachedLocation = JSON.parse(cachedLocationStr);
        if (isValidCoordinates(cachedLocation)) {
          return {
            event,
            position: cachedLocation
          };
        }
        // If cached coordinates are invalid, remove them
        localStorage.removeItem(`location_${event.location}`);
      }

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
        const location = data.results[0].geometry.location;
        if (isValidCoordinates(location)) {
          // Cache the valid location
          localStorage.setItem(`location_${event.location}`, JSON.stringify(location));
          return {
            event,
            position: location,
          };
        }
      }
      
      console.warn(`Could not geocode location for event: ${event.title}`);
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }, [googleMapsKey]);

  useEffect(() => {
    const geocodeAddresses = async () => {
      if (!googleMapsKey || !events.length) return;

      try {
        const locations = await Promise.all(
          events.map(geocodeAddress)
        );

        // Filter out null results and ensure valid coordinates
        const validLocations = locations.filter((loc): loc is NonNullable<typeof loc> => 
          loc !== null && isValidCoordinates(loc.position)
        );

        setEventLocations(validLocations);
      } catch (err) {
        const errorMessage = 'Failed to load event locations on the map';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    };

    if (googleMapsKey && events.length > 0) {
      geocodeAddresses();
    }
  }, [events, googleMapsKey, geocodeAddress]);

  return { eventLocations, error };
}
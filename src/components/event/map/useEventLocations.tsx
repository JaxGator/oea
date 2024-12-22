import { useState, useEffect, useCallback } from 'react';
import { Event } from "@/types/event";
import { toast } from "sonner";

interface EventLocation {
  event: Event;
  position: google.maps.LatLngLiteral;
}

const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export function useEventLocations(events: Event[], googleMapsKey: string) {
  const [eventLocations, setEventLocations] = useState<EventLocation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the geocoding function
  const geocodeAddress = useCallback(async (event: Event): Promise<EventLocation | null> => {
    try {
      // Check if we already have the location cached in localStorage
      const cachedData = localStorage.getItem(`location_${event.location}`);
      if (cachedData) {
        const { position, timestamp } = JSON.parse(cachedData);
        // Check if cache is still valid (less than 7 days old)
        if (timestamp && Date.now() - timestamp < CACHE_EXPIRY) {
          return { event, position };
        }
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          event.location
        )}&key=${googleMapsKey}`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();

      if (data.results && data.results[0]) {
        const position = data.results[0].geometry.location;
        // Cache the location with timestamp
        localStorage.setItem(
          `location_${event.location}`, 
          JSON.stringify({ 
            position,
            timestamp: Date.now()
          })
        );
        return { event, position };
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
      if (!googleMapsKey || !events.length) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Process all events in parallel
        const locations = await Promise.all(
          events.map(geocodeAddress)
        );

        setEventLocations(locations.filter((loc): loc is NonNullable<typeof loc> => loc !== null));
      } catch (err) {
        const errorMessage = 'Failed to load event locations on the map';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (googleMapsKey && events.length > 0) {
      geocodeAddresses();
    }
  }, [events, googleMapsKey, geocodeAddress]);

  return { eventLocations, error, isLoading };
}
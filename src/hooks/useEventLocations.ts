import { useState, useEffect } from 'react';
import { Event } from '@/types/event';

export interface Location {
  lat: number;
  lng: number;
  event: Event;
}

export const useEventLocations = (events: Event[]) => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const validEvents = events.filter(event => 
      event.latitude != null && 
      event.longitude != null
    );

    const eventLocations = validEvents.map(event => ({
      lat: event.latitude!,
      lng: event.longitude!,
      event
    }));

    setLocations(eventLocations);
  }, [events]);

  return locations;
};
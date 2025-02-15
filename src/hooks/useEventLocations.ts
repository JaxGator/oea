
import { useMemo } from 'react';
import { Event } from '@/types/event';

export interface Location {
  lat: number;
  lng: number;
  event: Event;
}

export const useEventLocations = (events: Event[]) => {
  return useMemo(() => {
    const validEvents = events.filter(event => 
      event.latitude != null && 
      event.longitude != null
    );

    return validEvents.map(event => ({
      lat: event.latitude!,
      lng: event.longitude!,
      event
    }));
  }, [events]);
};

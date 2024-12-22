import React, { useCallback, useState, lazy, Suspense } from 'react';
import { Event } from '@/types/event';
import { useAuthState } from '@/hooks/useAuthState';
import { EventMapError } from './map/EventMapError';
import { EventMapLoading } from './map/EventMapLoading';
import { useGoogleMapsKey } from './map/useGoogleMapsKey';
import { useEventLocations } from './map/useEventLocations';

// Lazy load the Google Maps components with preload
const GoogleMapComponent = lazy(() => import('./map/GoogleMapComponent'));
// Preload the component
if (typeof window !== 'undefined') {
  const preloadMap = () => import('./map/GoogleMapComponent');
  preloadMap();
}

interface EventsMapProps {
  events: Event[];
}

export function EventsMap({ events }: EventsMapProps) {
  const { user, profile } = useAuthState();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const isEnabled = Boolean(user && profile?.is_approved);
  
  const { googleMapsKey, error: keyError } = useGoogleMapsKey(isEnabled);
  const { eventLocations, error: locationsError, isLoading } = useEventLocations(events, googleMapsKey);

  // If user is not authenticated and approved, don't render the map
  if (!user || !profile?.is_approved) {
    return null;
  }

  if (keyError || locationsError) {
    return <EventMapError error={keyError || locationsError} />;
  }

  if (!googleMapsKey || isLoading) {
    return <EventMapLoading />;
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <Suspense fallback={<EventMapLoading />}>
        <GoogleMapComponent
          googleMapsKey={googleMapsKey}
          eventLocations={eventLocations}
          selectedEvent={selectedEvent}
          onEventSelect={setSelectedEvent}
        />
      </Suspense>
    </div>
  );
}
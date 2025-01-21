import { useState, useEffect } from 'react';
import { Event } from '@/types/event';
import { useEventLocations } from '@/hooks/useEventLocations';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { MapContainer } from './map/MapContainer';
import { EventPopup } from './map/EventPopup';
import { useMapMarkers } from '@/hooks/map/useMapMarkers';
import { MapLoadingState } from './map/MapLoadingState';
import { MapErrorState } from './map/MapErrorState';

interface EventsMapProps {
  events: Event[];
  selectedEventId?: string | null;
}

export function EventsMap({ events, selectedEventId }: EventsMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { mapToken, isLoading: isKeyLoading, error: keyError } = useMapboxToken();
  const locations = useEventLocations(events);

  // Find the selected event when selectedEventId changes
  useEffect(() => {
    if (selectedEventId) {
      const event = events.find(e => e.id === selectedEventId);
      if (event && event.latitude && event.longitude) {
        setSelectedEvent(event);
      }
    }
  }, [selectedEventId, events]);

  if (events.length === 0 || locations.length === 0) {
    return null;
  }

  if (isKeyLoading) {
    return <MapLoadingState />;
  }

  if (keyError || !mapToken) {
    return <MapErrorState message="Failed to load map configuration" />;
  }

  return (
    <MapContainer>
      {(map) => {
        // Initialize markers when map is ready
        useMapMarkers(map, locations, selectedEventId, (event) => setSelectedEvent(event));

        // Center map on selected event
        if (map && selectedEvent && selectedEvent.latitude && selectedEvent.longitude) {
          map.flyTo({
            center: [selectedEvent.longitude, selectedEvent.latitude],
            zoom: 14,
            duration: 1500
          });
        }

        return (
          selectedEvent && map && (
            <EventPopup
              event={selectedEvent}
              locations={locations}
              onClose={() => setSelectedEvent(null)}
              map={map}
            />
          )
        );
      }}
    </MapContainer>
  );
}
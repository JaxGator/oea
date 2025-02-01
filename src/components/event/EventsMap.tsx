import { useState, useEffect } from 'react';
import { Event } from '@/types/event';
import { useEventLocations } from '@/hooks/useEventLocations';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { MapContainer } from './map/MapContainer';
import { EventPopup } from './map/EventPopup';
import { useMapMarkers } from '@/hooks/map/useMapMarkers';
import { MapLoadingState } from './map/MapLoadingState';
import { MapErrorState } from './map/MapErrorState';
import { useMemo, useCallback } from 'react';
import { toast } from 'sonner';

interface EventsMapProps {
  events: Event[];
  selectedEventId?: string | null;
  isLoading?: boolean;
}

export function EventsMap({ events, selectedEventId, isLoading = false }: EventsMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { mapToken, isLoading: isKeyLoading, error: keyError } = useMapboxToken();
  const locations = useEventLocations(events);

  // Memoize locations to prevent unnecessary recalculations
  const memoizedLocations = useMemo(() => locations, [locations]);

  // Handle marker click with proper error handling
  const handleMarkerClick = useCallback((event: Event) => {
    try {
      setSelectedEvent(event);
    } catch (error) {
      console.error('Error selecting event:', error);
      toast.error('Failed to select event location');
    }
  }, []);

  // Find the selected event when selectedEventId changes
  useEffect(() => {
    if (selectedEventId) {
      const event = events.find(e => e.id === selectedEventId);
      if (event && event.latitude && event.longitude) {
        setSelectedEvent(event);
      }
    }
  }, [selectedEventId, events]);

  if (isLoading || events.length === 0 || locations.length === 0) {
    return <MapLoadingState />;
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
        useMapMarkers(map, memoizedLocations, selectedEventId, handleMarkerClick);

        // Center map on selected event with smooth animation
        if (map && selectedEvent && selectedEvent.latitude && selectedEvent.longitude) {
          map.flyTo({
            center: [selectedEvent.longitude, selectedEvent.latitude],
            zoom: 14,
            duration: 1500,
            essential: true,
            curve: 1.42, // Smooth easing function
            padding: { top: 50, bottom: 50, left: 50, right: 50 } // Add padding for better view
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
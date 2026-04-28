
import { useState, useEffect, useRef } from 'react';
import { Event } from '@/types/event';
import { useEventLocations } from '@/hooks/useEventLocations';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { EventPopup } from './map/EventPopup';
import { useMapMarkers } from '@/hooks/map/useMapMarkers';
import { MapLoadingState } from './map/MapLoadingState';
import { MapErrorState } from './map/MapErrorState';
import { useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { useMapInstance } from '@/hooks/map/useMapInstance';
import 'mapbox-gl/dist/mapbox-gl.css';

interface EventsMapProps {
  events: Event[];
  selectedEventId?: string | null;
  isLoading?: boolean;
  onError?: (error: string) => void;
}

export function EventsMap({ events, selectedEventId, isLoading = false, onError }: EventsMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { mapToken, isLoading: isKeyLoading, error: keyError } = useMapboxToken();
  const locations = useEventLocations(events);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useMapInstance(containerRef);

  const memoizedLocations = useMemo(() => locations, [locations]);

  const handleMarkerClick = useCallback((event: Event) => {
    try {
      setSelectedEvent(event);
    } catch (error) {
      console.error('Error selecting event:', error);
      toast.error('Failed to select event location');
    }
  }, []);

  useMapMarkers(mapInstance.current, memoizedLocations, selectedEventId ?? null, handleMarkerClick);

  useEffect(() => {
    if (selectedEventId) {
      const event = events.find(e => e.id === selectedEventId);
      if (event && event.latitude && event.longitude) {
        setSelectedEvent(event);
      }
    } else {
      setSelectedEvent(null);
    }
  }, [selectedEventId, events]);

  useEffect(() => {
    if (keyError && onError) {
      onError('Failed to load map configuration');
    }
  }, [keyError, onError]);

  useEffect(() => {
    const map = mapInstance.current;
    if (map && selectedEvent && selectedEvent.latitude && selectedEvent.longitude) {
      map.flyTo({
        center: [selectedEvent.longitude, selectedEvent.latitude],
        zoom: 14,
        duration: 1000,
        essential: true,
        curve: 1.42,
        padding: { top: 50, bottom: 50, left: 50, right: 50 }
      });
    }
  }, [selectedEvent, mapInstance]);

  if (isLoading || events.length === 0 || locations.length === 0) {
    return <MapLoadingState />;
  }

  if (isKeyLoading) {
    return <MapLoadingState />;
  }

  if (keyError || !mapToken) {
    const errorMessage = 'Failed to load map configuration';
    if (onError) {
      onError(errorMessage);
    }
    return <MapErrorState message={errorMessage} />;
  }

  const map = mapInstance.current;

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8">
      <div
        ref={containerRef}
        className="w-full h-[400px]"
        style={{
          minHeight: '400px',
          background: '#f0f0f0',
          position: 'relative'
        }}
      />
      {selectedEvent && map && (
        <EventPopup
          event={selectedEvent}
          locations={locations}
          onClose={() => setSelectedEvent(null)}
          map={map}
        />
      )}
    </div>
  );
}

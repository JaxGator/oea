import { useState, useCallback, useMemo, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Event } from '@/types/event';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { useEventLocations } from '@/hooks/useEventLocations';
import { EventInfoWindow } from './EventInfoWindow';
import { MapLoadingState } from './map/MapLoadingState';
import { MapErrorState } from './map/MapErrorState';

interface EventsMapProps {
  events: Event[];
  selectedEventId?: string | null;
}

export function EventsMap({ events, selectedEventId }: EventsMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const { mapToken, isLoading: isKeyLoading, error: keyError } = useMapboxToken();
  const locations = useEventLocations(events, mapToken);

  const mapContainer = useCallback((node: HTMLDivElement) => {
    if (node && mapToken && locations.length > 0) {
      mapboxgl.accessToken = mapToken;

      const newMap = new mapboxgl.Map({
        container: node,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [locations[0].lng, locations[0].lat],
        zoom: 12
      });

      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      setMap(newMap);

      return () => {
        newMap.remove();
      };
    }
  }, [mapToken, locations]);

  // Update markers when locations change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while (markers[0]) {
      markers[0].remove();
    }

    // Add new markers
    locations.forEach(location => {
      const isSelected = location.event.id === selectedEventId;
      
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = isSelected ? '#4A90E2' : '#FF5A5F';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

      el.addEventListener('click', () => {
        setSelectedEvent(location.event);
      });

      new mapboxgl.Marker(el)
        .setLngLat([location.lng, location.lat])
        .addTo(map);
    });
  }, [map, locations, selectedEventId]);

  // Update map center when selectedEventId changes
  useEffect(() => {
    if (!map || !selectedEventId) return;

    const selectedLocation = locations.find(loc => loc.event.id === selectedEventId);
    if (selectedLocation) {
      map.flyTo({
        center: [selectedLocation.lng, selectedLocation.lat],
        zoom: 14,
        duration: 1500
      });
    }
  }, [map, selectedEventId, locations]);

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
    <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8">
      <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />
      {selectedEvent && (
        <EventInfoWindow
          event={selectedEvent}
          locations={locations}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
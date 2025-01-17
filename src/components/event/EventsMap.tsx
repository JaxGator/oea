import { useState, useEffect, useRef } from 'react';
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
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const { mapToken, isLoading: isKeyLoading, error: keyError } = useMapboxToken();
  const locations = useEventLocations(events, mapToken);

  // Initialize map when container and token are ready
  useEffect(() => {
    if (!mapContainer.current || !mapToken || locations.length === 0) return;

    mapboxgl.accessToken = mapToken;
    
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [locations[0].lng, locations[0].lat],
      zoom: 12
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapInstance.current = map;

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Clean up map
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [mapToken, locations]);

  // Update markers when locations change
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clean up existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

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

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.lng, location.lat])
        .addTo(mapInstance.current!);

      markersRef.current.push(marker);
    });
  }, [locations, selectedEventId]);

  // Update map center when selectedEventId changes
  useEffect(() => {
    if (!mapInstance.current || !selectedEventId) return;

    const selectedLocation = locations.find(loc => loc.event.id === selectedEventId);
    if (selectedLocation) {
      mapInstance.current.flyTo({
        center: [selectedLocation.lng, selectedLocation.lat],
        zoom: 14,
        duration: 1500
      });
    }
  }, [selectedEventId, locations]);

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
      {selectedEvent && mapInstance.current && (
        <EventInfoWindow
          event={selectedEvent}
          locations={locations}
          onClose={() => setSelectedEvent(null)}
          map={mapInstance.current}
        />
      )}
    </div>
  );
}
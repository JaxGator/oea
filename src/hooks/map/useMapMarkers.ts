
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Location } from '@/hooks/useEventLocations';

export const useMapMarkers = (
  map: mapboxgl.Map | null,
  locations: Location[],
  selectedEventId: string | null,
  onMarkerClick: (event: Location['event']) => void
) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const isMarkersInitialized = useRef(false);

  useEffect(() => {
    if (!map || isMarkersInitialized.current) return;

    const handler = () => {
      isMarkersInitialized.current = true;
      
      // Clear existing markers
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
          onMarkerClick(location.event);
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat([location.lng, location.lat])
          .addTo(map);
        
        markersRef.current.push(marker);
      });

      // Center map on selected event or first location
      const selectedLocation = locations.find(loc => loc.event.id === selectedEventId);
      if (selectedLocation) {
        map.flyTo({
          center: [selectedLocation.lng, selectedLocation.lat],
          zoom: 14,
          duration: 1500
        });
      } else if (locations.length > 0) {
        map.flyTo({
          center: [locations[0].lng, locations[0].lat],
          zoom: 12
        });
      }
    };

    if (map.loaded()) {
      handler();
    } else {
      map.once('load', handler);
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      isMarkersInitialized.current = false;
    };
  }, [map, locations, selectedEventId, onMarkerClick]);
};

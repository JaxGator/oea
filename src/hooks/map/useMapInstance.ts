import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMapboxToken } from '@/hooks/useMapboxToken';

export const useMapInstance = (containerRef: React.RefObject<HTMLDivElement>) => {
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const { mapToken } = useMapboxToken();

  useEffect(() => {
    if (!containerRef.current || !mapToken || mapInstance.current) {
      console.log('Map instance initialization skipped:', {
        hasContainer: !!containerRef.current,
        hasToken: !!mapToken,
        hasExistingInstance: !!mapInstance.current
      });
      return;
    }

    console.log('Initializing map instance with token:', !!mapToken);
    mapboxgl.accessToken = mapToken;
    
    try {
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        zoom: 12,
        center: [-122.4194, 37.7749], // Default center, will be updated when markers are added
        preserveDrawingBuffer: true // Helps with map rendering issues
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      mapInstance.current = map;

      // Ensure the map is properly initialized
      map.on('load', () => {
        console.log('Map style loaded successfully');
        map.resize(); // Ensure proper sizing after load
      });

      map.on('error', (e) => {
        console.error('Map instance error:', e);
      });

    } catch (error) {
      console.error('Error initializing map instance:', error);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [mapToken]);

  return mapInstance;
};
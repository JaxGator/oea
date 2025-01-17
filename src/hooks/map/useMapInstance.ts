import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMapboxToken } from '@/hooks/useMapboxToken';

export const useMapInstance = (containerRef: React.RefObject<HTMLDivElement>) => {
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const { mapToken } = useMapboxToken();

  useEffect(() => {
    if (!containerRef.current || !mapToken || mapInstance.current) return;

    mapboxgl.accessToken = mapToken;
    
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      zoom: 12
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapInstance.current = map;

    // Ensure the map is properly initialized
    map.on('style.load', () => {
      console.log('Map style loaded successfully');
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [mapToken]);

  return mapInstance;
};
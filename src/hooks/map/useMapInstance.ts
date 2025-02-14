
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMapboxToken } from '@/hooks/useMapboxToken';

export const useMapInstance = (containerRef: React.RefObject<HTMLDivElement>) => {
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const { mapToken } = useMapboxToken();
  const initializeAttempted = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !mapToken || mapInstance.current || initializeAttempted.current) {
      return;
    }

    try {
      initializeAttempted.current = true;
      console.log('Initializing map instance...');
      mapboxgl.accessToken = mapToken;
      
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        zoom: 12,
        center: [-81.655651, 30.332184], // Jacksonville, FL coordinates
        preserveDrawingBuffer: true
      });

      map.on('load', () => {
        console.log('Map style loaded successfully');
        if (map && !map._removed) {
          map.resize();
          map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        }
      });

      mapInstance.current = map;

    } catch (error) {
      console.error('Error initializing map instance:', error);
      initializeAttempted.current = false;
    }

    return () => {
      if (mapInstance.current && !mapInstance.current._removed) {
        mapInstance.current.remove();
        mapInstance.current = null;
        initializeAttempted.current = false;
      }
    };
  }, [mapToken]);

  return mapInstance;
};

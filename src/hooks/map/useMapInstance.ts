
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMapboxToken } from '@/hooks/useMapboxToken';

export const useMapInstance = (containerRef: React.RefObject<HTMLDivElement>) => {
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const { mapToken } = useMapboxToken();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let initTimeout: NodeJS.Timeout;

    const initializeMap = () => {
      if (!containerRef.current || !mapToken || mapInstance.current || isInitialized) {
        console.log('Map initialization skipped:', {
          hasContainer: !!containerRef.current,
          hasToken: !!mapToken,
          hasExistingInstance: !!mapInstance.current,
          isInitialized
        });
        return;
      }

      try {
        console.log('Initializing map instance...');
        mapboxgl.accessToken = mapToken;
        
        const map = new mapboxgl.Map({
          container: containerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          zoom: 12,
          center: [-81.655651, 30.332184], // Jacksonville, FL coordinates
          preserveDrawingBuffer: true
        });

        // Wait for the map to be fully loaded before adding controls
        map.on('load', () => {
          console.log('Map style loaded successfully');
          if (map && !map.removed) {
            map.resize();
            setIsInitialized(true);
          }
        });

        map.on('error', (e) => {
          console.error('Map instance error:', e);
        });

        // Add controls after a short delay to ensure container is ready
        initTimeout = setTimeout(() => {
          if (map && !map.removed) {
            map.addControl(new mapboxgl.NavigationControl(), 'top-right');
          }
        }, 100);

        mapInstance.current = map;

      } catch (error) {
        console.error('Error initializing map instance:', error);
        setIsInitialized(false);
      }
    };

    initializeMap();

    return () => {
      if (initTimeout) {
        clearTimeout(initTimeout);
      }
      if (mapInstance.current) {
        console.log('Cleaning up map instance');
        mapInstance.current.remove();
        mapInstance.current = null;
        setIsInitialized(false);
      }
    };
  }, [mapToken, containerRef, isInitialized]);

  return mapInstance;
};

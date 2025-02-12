
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { MapLoadingState } from '../map/MapLoadingState';
import { MapErrorState } from '../map/MapErrorState';

interface EventLocationMapProps {
  location: string;
  lat?: number;
  lng?: number;
}

export function EventLocationMap({ location, lat, lng }: EventLocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const { mapToken, isLoading: isKeyLoading, error: keyError } = useMapboxToken();
  const [isMapReady, setIsMapReady] = useState(false);

  // Effect for map initialization
  useEffect(() => {
    let initTimeout: NodeJS.Timeout;

    const initializeMap = () => {
      if (!mapContainer.current || !lat || !lng || !mapToken || map.current) {
        return;
      }

      try {
        console.log('Initializing map with coordinates:', { lat, lng });
        mapboxgl.accessToken = mapToken;
        
        const mapInstance = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/outdoors-v12',
          center: [lng, lat],
          zoom: 14,
          scrollZoom: false
        });

        // Initialize map controls and marker after the map is fully loaded
        mapInstance.on('load', () => {
          console.log('Map loaded successfully');
          if (!mapInstance.removed) {
            mapInstance.resize();
            
            // Add controls after a short delay
            initTimeout = setTimeout(() => {
              if (!mapInstance.removed) {
                mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
                
                // Create marker only after map is fully initialized
                marker.current = new mapboxgl.Marker()
                  .setLngLat([lng, lat])
                  .addTo(mapInstance);
                
                setIsMapReady(true);
              }
            }, 100);
          }
        });

        map.current = mapInstance;

      } catch (error) {
        console.error('Error initializing map:', error);
        setIsMapReady(false);
      }
    };

    initializeMap();

    return () => {
      if (initTimeout) {
        clearTimeout(initTimeout);
      }
      if (map.current) {
        if (marker.current) {
          marker.current.remove();
          marker.current = null;
        }
        map.current.remove();
        map.current = null;
        setIsMapReady(false);
      }
    };
  }, [lat, lng, mapToken]);

  // Separate effect for updating marker position
  useEffect(() => {
    if (!isMapReady || !marker.current || !map.current || !lat || !lng) {
      return;
    }

    marker.current.setLngLat([lng, lat]);
    map.current.flyTo({
      center: [lng, lat],
      zoom: 14,
      essential: true
    });
  }, [lat, lng, isMapReady]);

  if (isKeyLoading) {
    return <MapLoadingState />;
  }

  if (keyError || !mapToken) {
    return <MapErrorState message="Failed to load map configuration" />;
  }

  if (!lat || !lng) {
    return (
      <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Location not found on map</p>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className="h-full w-full rounded-lg" />
  );
}

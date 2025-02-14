
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { MapLoadingState } from './map/MapLoadingState';
import { MapErrorState } from './map/MapErrorState';

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
  const hasInitialized = useRef(false);

  useEffect(() => {
    console.log('EventLocationMap mount - token:', mapToken, 'coords:', { lat, lng });
    
    if (!mapContainer.current || !lat || !lng || !mapToken || hasInitialized.current) {
      console.log('Skipping map initialization - missing requirements:', {
        hasContainer: !!mapContainer.current,
        hasCoords: !!(lat && lng),
        hasToken: !!mapToken,
        alreadyInitialized: hasInitialized.current
      });
      return;
    }

    try {
      console.log('Initializing map with coordinates:', { lat, lng });
      mapboxgl.accessToken = mapToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: 14,
        scrollZoom: false
      });

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        if (map.current && !map.current._removed) {
          map.current.resize();
          
          // Add marker after map is loaded
          marker.current = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map.current);
            
          map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        }
      });

      hasInitialized.current = true;
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      console.log('Cleaning up map');
      if (marker.current) {
        marker.current.remove();
      }
      if (map.current && !map.current._removed) {
        map.current.remove();
        hasInitialized.current = false;
      }
    };
  }, [lat, lng, mapToken]);

  if (isKeyLoading) {
    return <MapLoadingState />;
  }

  if (keyError || !mapToken) {
    console.error('Map token error:', keyError);
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

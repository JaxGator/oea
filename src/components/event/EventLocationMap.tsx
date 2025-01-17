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

  useEffect(() => {
    if (!mapContainer.current || !lat || !lng || !mapToken) {
      console.log('Map initialization skipped:', { 
        hasContainer: !!mapContainer.current, 
        lat, 
        lng, 
        hasToken: !!mapToken 
      });
      return;
    }

    console.log('Initializing map with:', { lat, lng, mapToken: !!mapToken });
    mapboxgl.accessToken = mapToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [lng, lat],
        zoom: 14,
        scrollZoom: false
      });

      marker.current = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.current);

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Ensure the map loads the location correctly
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        if (map.current) {
          map.current.flyTo({
            center: [lng, lat],
            zoom: 14,
            essential: true
          });
        }
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [lat, lng, mapToken]);

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
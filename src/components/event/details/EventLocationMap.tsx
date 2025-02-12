
import { useEffect, useRef } from 'react';
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
  const hasInitialized = useRef(false);

  // Effect for map initialization
  useEffect(() => {
    // Only initialize when we have all required data and token
    if (!mapContainer.current || !lat || !lng || !mapToken) {
      return;
    }

    try {
      if (!hasInitialized.current) {
        console.log('Initializing map with token and coordinates:', { lat, lng });
        mapboxgl.accessToken = mapToken;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/outdoors-v12',
          center: [lng, lat],
          zoom: 14,
          scrollZoom: false
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        marker.current = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current);

        hasInitialized.current = true;
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        hasInitialized.current = false;
      }
    };
  }, [lat, lng, mapToken]);

  // Separate effect for updating marker position
  useEffect(() => {
    if (marker.current && lat && lng) {
      marker.current.setLngLat([lng, lat]);
    }
    if (map.current && lat && lng) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 14,
        essential: true
      });
    }
  }, [lat, lng]);

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

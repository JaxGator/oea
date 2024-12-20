import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Event } from '@/types/event';
import { supabase } from '@/integrations/supabase/client';

interface EventsMapProps {
  events: Event[];
}

export function EventsMap({ events }: EventsMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      // Fetch Mapbox token from Supabase Edge Function secrets
      const { data: { token }, error } = await supabase.functions.invoke('get-mapbox-token');
      if (error) {
        console.error('Error fetching Mapbox token:', error);
        return;
      }

      mapboxgl.accessToken = token;

      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        zoom: 4,
        center: [-98.5795, 39.8283], // Center of USA
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add markers for each event
      const bounds = new mapboxgl.LngLatBounds();
      const markers: mapboxgl.Marker[] = [];

      for (const event of events) {
        // Convert address to coordinates using Mapbox Geocoding API
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            event.location
          )}.json?access_token=${token}`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          
          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-semibold">${event.title}</h3>
              <p class="text-sm">${event.location}</p>
              <p class="text-sm">${event.date} at ${event.time}</p>
            </div>
          `);

          // Create marker
          const marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map.current);

          markers.push(marker);
          bounds.extend([lng, lat]);
        }
      }

      // Store markers for cleanup
      markersRef.current = markers;

      // Fit map to bounds if there are markers
      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
        });
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [events]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg mb-8">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
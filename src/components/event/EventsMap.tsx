import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const fetchMapboxToken = async () => {
      const { data, error } = await supabase.functions.invoke('get-mapbox-token');
      if (error) {
        console.error('Error fetching Mapbox token:', error);
        return;
      }
      return data.token;
    };

    const initializeMap = async () => {
      if (!mapContainer.current) return;

      const token = await fetchMapboxToken();
      if (!token) return;

      mapboxgl.accessToken = token;

      // Filter out events without locations
      const validEvents = events.filter(event => 
        event.location && event.location.trim() !== ''
      );

      if (validEvents.length === 0) return;

      // Create the map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        zoom: 12,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add markers for each event
      const bounds = new mapboxgl.LngLatBounds();
      
      // Add markers sequentially
      validEvents.forEach(async (event) => {
        try {
          // Geocode the location
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(event.location)}.json?access_token=${token}`
          );
          const data = await response.json();

          if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;

            // Create a marker
            new mapboxgl.Marker()
              .setLngLat([lng, lat])
              .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                  .setHTML(`
                    <strong>${event.title}</strong><br>
                    ${event.date} at ${event.time}<br>
                    ${event.location}
                  `)
              )
              .addTo(map.current!);

            // Extend bounds
            bounds.extend([lng, lat]);

            // Fit bounds after adding all markers
            map.current?.fitBounds(bounds, {
              padding: 50,
              maxZoom: 14,
            });
          }
        } catch (error) {
          console.error('Error geocoding location:', error);
        }
      });
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [events]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg mb-8">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
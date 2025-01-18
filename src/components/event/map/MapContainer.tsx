import { useRef, useEffect } from 'react';
import { useMapInstance } from '@/hooks/map/useMapInstance';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapContainerProps {
  children: (map: mapboxgl.Map | null) => React.ReactNode;
}

export function MapContainer({ children }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useMapInstance(containerRef);

  // Ensure the map container takes up space even before the map is loaded
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.minHeight = '400px';
    }
  }, []);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8">
      <div 
        ref={containerRef} 
        className="w-full h-[400px]" 
        style={{ 
          minHeight: '400px',
          background: '#f0f0f0' // Light background while map loads
        }} 
      />
      {children(mapInstance.current)}
    </div>
  );
}
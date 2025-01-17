import { useRef } from 'react';
import { useMapInstance } from '@/hooks/map/useMapInstance';

interface MapContainerProps {
  children: (map: mapboxgl.Map | null) => React.ReactNode;
}

export function MapContainer({ children }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useMapInstance(containerRef);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8">
      <div ref={containerRef} style={{ width: '100%', height: '400px' }} />
      {children(mapInstance.current)}
    </div>
  );
}
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useState } from 'react';

interface EventMapProps {
  mapKey: string;
  coordinates: { lat: number; lng: number };
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

export function EventMap({ mapKey, coordinates }: EventMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <div className="h-[300px] rounded-lg overflow-hidden shadow-lg">
      <LoadScript 
        googleMapsApiKey={mapKey}
        libraries={libraries}
        onLoad={() => setMapLoaded(true)}
      >
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          zoom={14}
          center={coordinates}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            styles: [{ featureType: 'all', elementType: 'geometry', stylers: [{ lightness: 20 }] }],
          }}
        >
          {mapLoaded && <Marker position={coordinates} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
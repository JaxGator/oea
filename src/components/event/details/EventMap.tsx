import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface EventMapProps {
  mapKey: string;
  coordinates: { lat: number; lng: number };
}

export function EventMap({ mapKey, coordinates }: EventMapProps) {
  return (
    <div className="h-[300px] rounded-lg overflow-hidden shadow-lg">
      <LoadScript googleMapsApiKey={mapKey}>
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
          <Marker position={coordinates} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
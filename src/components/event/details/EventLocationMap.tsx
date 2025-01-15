import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMapsToken } from '@/hooks/useGoogleMapsToken';
import { MapLoadingState } from '../map/MapLoadingState';
import { MapErrorState } from '../map/MapErrorState';

interface EventLocationMapProps {
  location: string;
  lat?: number;
  lng?: number;
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

export function EventLocationMap({ location, lat, lng }: EventLocationMapProps) {
  const { mapKey, isLoading: isKeyLoading, error: keyError } = useGoogleMapsToken();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: mapKey || '',
    libraries,
  });

  if (isKeyLoading) {
    return <MapLoadingState />;
  }

  if (keyError || !mapKey) {
    return <MapErrorState message="Failed to load map configuration" />;
  }

  if (loadError) {
    return <MapErrorState message="Error loading map" />;
  }

  if (!isLoaded) {
    return <MapLoadingState />;
  }

  if (!lat || !lng) {
    return (
      <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Location not found on map</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{
        width: '100%',
        height: '100%',
      }}
      zoom={15}
      center={{ lat, lng }}
      options={{
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      }}
    >
      <Marker position={{ lat, lng }} />
    </GoogleMap>
  );
}
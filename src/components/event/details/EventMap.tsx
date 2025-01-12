import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventMapProps {
  mapKey: string;
  location: string;
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

export function EventMap({ mapKey, location }: EventMapProps) {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const geocodeAddress = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            location
          )}&key=${mapKey}`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          setCoordinates(data.results[0].geometry.location);
          setError(null);
        } else {
          setError('Location not found');
        }
      } catch (err) {
        setError('Error loading map');
        console.error('Geocoding error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (location && mapKey) {
      geocodeAddress();
    }
  }, [location, mapKey]);

  const handleGetDirections = () => {
    const destination = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
  };

  if (error) {
    return (
      <div className="h-[300px] rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error}</p>
          <Button variant="outline" onClick={handleGetDirections}>
            <MapPin className="mr-2 h-4 w-4" />
            Get Directions
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !coordinates) {
    return (
      <div className="h-[300px] rounded-lg overflow-hidden">
        <Skeleton className="w-full h-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="h-[300px] rounded-lg overflow-hidden shadow-lg relative">
      <LoadScript googleMapsApiKey={mapKey} libraries={libraries}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          zoom={14}
          center={coordinates}
          options={{
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            styles: [{ featureType: 'all', elementType: 'geometry', stylers: [{ lightness: 20 }] }],
          }}
        >
          <Marker position={coordinates} />
        </GoogleMap>
      </LoadScript>
      <div className="absolute bottom-4 right-4 z-10">
        <Button variant="secondary" size="sm" onClick={handleGetDirections}>
          <MapPin className="mr-2 h-4 w-4" />
          Get Directions
        </Button>
      </div>
    </div>
  );
}
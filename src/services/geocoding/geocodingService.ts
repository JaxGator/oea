
import { supabase } from "@/integrations/supabase/client";

interface GeocodingResult {
  latitude: number;
  longitude: number;
}

/**
 * Geocodes a location string to latitude and longitude coordinates
 * @param location The location string to geocode
 * @returns A Promise that resolves to the geocoding result or null if geocoding failed
 */
export async function geocodeLocation(location: string): Promise<GeocodingResult | null> {
  try {
    const { data: { token }, error: tokenError } = await supabase.functions.invoke('get-mapbox-token');
    
    if (tokenError) {
      console.error('Error getting Mapbox token:', tokenError);
      return null;
    }

    const query = encodeURIComponent(location);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}`
    );
    
    if (!response.ok) {
      console.error('Geocoding fetch error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return { latitude, longitude };
    }
    
    console.log('No geocoding results found for:', location);
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}


/**
 * Geocodes an address to latitude and longitude
 * @param address The address to geocode
 * @returns The geocoded coordinates or null if geocoding failed
 */
export async function geocodeAddress(address: string) {
  try {
    // Simple validation
    if (!address.trim()) {
      console.warn('Empty address provided for geocoding');
      return null;
    }
    
    console.log(`Geocoding address: ${address}`);
    
    // Using MapBox Geocoding API
    // Note: In a real app, you would use your own API key
    const apiKey = process.env.MAPBOX_API_KEY;
    if (!apiKey) {
      console.warn('No Mapbox API key available for geocoding');
      return null;
    }
    
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return { latitude, longitude };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

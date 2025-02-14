
import { useState } from 'react';
import { toast } from 'sonner';
import { LocationSuggestion } from '../types/location';

export function useLocationSearch(mapToken: string | undefined) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchLocations = async (searchValue: string) => {
    if (!searchValue || searchValue.length < 3 || !mapToken) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    setIsSearching(true);
    console.log('Searching locations with token status:', !!mapToken);

    try {
      // Using fuzzy matching and no type restrictions for broader results
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        searchValue
      )}.json?access_token=${mapToken}&country=us&fuzzy_match=true&limit=15`;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch locations: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Mapbox API response received:', { 
        status: response.status, 
        hasFeatures: !!data?.features,
        featureCount: data?.features?.length,
        features: data?.features 
      });
      
      if (!data?.features || !Array.isArray(data.features)) {
        setSuggestions([]);
        return;
      }

      const validSuggestions = data.features
        .filter((feature: any) => 
          feature && 
          typeof feature.place_name === 'string' &&
          Array.isArray(feature.center) &&
          feature.center.length === 2
        )
        .map((feature: any) => ({
          place_name: feature.place_name,
          center: feature.center as [number, number]
        }));
      
      console.log('Found suggestions:', validSuggestions.length);
      setSuggestions(validSuggestions);
      setIsDropdownOpen(validSuggestions.length > 0);
    } catch (error) {
      console.error('Error searching locations:', error);
      toast.error('Error searching for locations. Please try again.');
      setSuggestions([]);
      setIsDropdownOpen(false);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    suggestions,
    isDropdownOpen,
    setIsDropdownOpen,
    isSearching,
    searchLocations
  };
}


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
    console.log('Searching locations with query:', searchValue);

    try {
      // Using only the valid types as specified in the API error message
      const types = [
        'country',
        'region',
        'place',
        'district',
        'locality',
        'postcode',
        'neighborhood',
        'address'
      ].join(',');

      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        searchValue
      )}.json?access_token=${mapToken}&types=${types}&proximity=-81.5366144,30.1334528&limit=10&language=en&autocomplete=true`;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch locations: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Mapbox API full response:', data);
      
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
        .map((feature: any) => {
          // Enhanced logging to understand what we're getting
          console.log('Feature details:', {
            id: feature.id,
            type: feature.place_type,
            text: feature.text,
            place_name: feature.place_name,
            relevance: feature.relevance,
            properties: feature.properties,
            context: feature.context
          });
          
          return {
            place_name: feature.place_name,
            center: feature.center as [number, number]
          };
        });
      
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

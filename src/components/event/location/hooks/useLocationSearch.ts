
import { useState } from 'react';
import { toast } from 'sonner';
import { LocationSuggestion } from '../types/location';

export function useLocationSearch(mapToken: string | undefined) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const sessionToken = crypto.randomUUID(); // Generate a session token for the search session

  const searchLocations = async (searchValue: string) => {
    if (!searchValue || searchValue.length < 3 || !mapToken) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    setIsSearching(true);
    console.log('Searching locations with query:', searchValue);

    try {
      const endpoint = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(
        searchValue
      )}&access_token=${mapToken}&session_token=${sessionToken}&language=en&limit=10&types=postcode,place,neighborhood,address,poi,street,category&proximity=-81.5366144,30.1334528`;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch locations: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Mapbox Search API response:', data);
      
      if (!data?.suggestions || !Array.isArray(data.suggestions)) {
        setSuggestions([]);
        return;
      }

      const validSuggestions = data.suggestions
        .filter((suggestion: any) => 
          suggestion &&
          typeof suggestion.name === 'string' &&
          suggestion.context?.address?.name
        )
        .map((suggestion: any) => {
          // Enhanced logging to understand what we're getting
          console.log('Processing suggestion:', {
            name: suggestion.name,
            type: suggestion.feature_type,
            address: suggestion.full_address,
            category: suggestion.poi_category
          });
          
          // Parse coordinates from mapbox_id if available
          return {
            place_name: `${suggestion.name}, ${suggestion.full_address}`,
            // We'll need to retrieve exact coordinates in a separate retrieve call
            // For now, we'll store the mapbox_id to look up coordinates later
            mapbox_id: suggestion.mapbox_id,
            // Placeholder coordinates until we get the exact location
            center: [0, 0] as [number, number]
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

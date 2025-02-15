
import { useState } from 'react';
import { toast } from 'sonner';
import { LocationSuggestion, RetrieveResponse } from '../types/location';

export function useLocationSearch(mapToken: string | undefined) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const sessionToken = crypto.randomUUID();

  const retrieveCoordinates = async (mapboxId: string): Promise<[number, number] | null> => {
    if (!mapToken) return null;

    try {
      const endpoint = `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?access_token=${mapToken}&session_token=${sessionToken}`;
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to retrieve coordinates: ${response.statusText}`);
      }

      const data: RetrieveResponse = await response.json();
      console.log('Coordinate retrieval response:', data);

      if (data.features?.[0]?.geometry?.coordinates) {
        return data.features[0].geometry.coordinates;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving coordinates:', error);
      return null;
    }
  };

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
      )}&access_token=${mapToken}&session_token=${sessionToken}&language=en&limit=10&types=poi,address,street,place&proximity=-81.5366144,30.1334528&country=US`;

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
          suggestion.name &&
          suggestion.full_address
        )
        .map((suggestion: any) => ({
          place_name: `${suggestion.name}, ${suggestion.full_address}`,
          mapbox_id: suggestion.mapbox_id,
          center: [0, 0] // Will be updated when selected
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
    searchLocations,
    retrieveCoordinates
  };
}

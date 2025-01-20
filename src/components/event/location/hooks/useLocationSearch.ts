import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';
import { LocationSuggestion } from '../types/location';

export function useLocationSearch(mapToken: string | undefined) {
  const [searchValue, setSearchValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    const searchLocations = async () => {
      setSuggestions([]);
      
      if (!debouncedSearch || debouncedSearch.length < 3 || !mapToken) {
        setIsDropdownOpen(false);
        return;
      }

      try {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          debouncedSearch
        )}.json?access_token=${mapToken}&country=us&types=place,district,locality,neighborhood,address,poi&limit=10`;

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }

        const data = await response.json();
        
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
        
        setSuggestions(validSuggestions);
        setIsDropdownOpen(validSuggestions.length > 0);
      } catch (error) {
        console.error('Error searching locations:', error);
        toast.error('Error searching for locations. Please try again.');
        setSuggestions([]);
        setIsDropdownOpen(false);
      }
    };

    searchLocations();
  }, [debouncedSearch, mapToken]);

  return {
    searchValue,
    setSearchValue,
    suggestions,
    isDropdownOpen,
    setIsDropdownOpen
  };
}
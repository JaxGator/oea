import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/use-debounce';

interface LocationSearchInputProps {
  onLocationSelect: (suggestion: { place_name: string; center: [number, number] }) => void;
  currentValue?: string;
  disabled?: boolean;
}

interface Suggestion {
  place_name: string;
  center: [number, number];
}

export function LocationSearchInput({ 
  onLocationSelect, 
  currentValue = '', 
  disabled = false 
}: LocationSearchInputProps) {
  const [searchValue, setSearchValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const debouncedSearch = useDebounce(searchValue, 300);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mapToken, isLoading, error } = useMapboxToken();

  useEffect(() => {
    if (currentValue !== undefined) {
      setSearchValue(currentValue);
    }
  }, [currentValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        )}.json?access_token=${mapToken}&country=us&types=poi,address,place,locality,neighborhood&limit=10`;

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

  if (error) {
    return <div className="p-4 text-red-500">Error loading location search</div>;
  }

  if (isLoading) {
    return <div className="p-4">Loading location search...</div>;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Input
        placeholder="Search for a location or business..."
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          if (e.target.value.length >= 3) {
            setIsDropdownOpen(true);
          }
        }}
        disabled={disabled}
        className="w-full"
      />
      
      {isDropdownOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_name}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              onClick={() => {
                onLocationSelect(suggestion);
                setSearchValue(suggestion.place_name);
                setIsDropdownOpen(false);
              }}
            >
              {suggestion.place_name}
            </button>
          ))}
        </div>
      )}
      
      {isDropdownOpen && suggestions.length === 0 && searchValue.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-4 text-center text-gray-500">
          No locations found
        </div>
      )}
    </div>
  );
}
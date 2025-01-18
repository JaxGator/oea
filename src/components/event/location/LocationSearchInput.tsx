import { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { toast } from 'sonner';

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
  const [searchValue, setSearchValue] = useState<string>(currentValue || '');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const { mapToken, isLoading, error } = useMapboxToken();

  useEffect(() => {
    if (currentValue !== undefined) {
      setSearchValue(currentValue);
    }
  }, [currentValue]);

  const searchLocations = async (query: string) => {
    // Always ensure suggestions is initialized as an array
    setSuggestions([]);

    // Don't search if query is too short or no token
    if (!query || query.length < 3 || !mapToken) {
      return;
    }

    try {
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${mapToken}&types=address,place,locality,neighborhood`;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data = await response.json();
      
      // Validate features exists and is an array
      if (!data?.features || !Array.isArray(data.features)) {
        console.log('No valid features in response:', data);
        return;
      }

      // Safely map features to suggestions with proper type checking
      const newSuggestions = data.features
        .filter((feature: any) => feature && typeof feature === 'object')
        .map((feature: any) => {
          // Ensure center coordinates are valid
          const center = Array.isArray(feature.center) && 
            feature.center.length === 2 && 
            typeof feature.center[0] === 'number' && 
            typeof feature.center[1] === 'number'
            ? feature.center as [number, number]
            : [0, 0];

          return {
            place_name: typeof feature.place_name === 'string' ? feature.place_name : '',
            center
          };
        })
        .filter(suggestion => suggestion.place_name && suggestion.center[0] !== 0);
      
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error searching locations:', error);
      toast.error('Error searching for locations. Please try again.');
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">Error loading location search</div>;
  }

  if (isLoading) {
    return <div className="p-4">Loading location search...</div>;
  }

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        placeholder="Search for a location..."
        value={searchValue}
        onValueChange={(value) => {
          setSearchValue(value);
          searchLocations(value);
        }}
        disabled={disabled}
      />
      <CommandGroup>
        {suggestions.length === 0 ? (
          <CommandEmpty>
            {searchValue.length < 3 
              ? "Enter at least 3 characters to search..." 
              : "No locations found."}
          </CommandEmpty>
        ) : (
          suggestions.map((suggestion) => (
            <CommandItem
              key={suggestion.place_name}
              value={suggestion.place_name}
              onSelect={() => {
                onLocationSelect(suggestion);
                setSearchValue(suggestion.place_name);
                setSuggestions([]);
              }}
            >
              {suggestion.place_name}
            </CommandItem>
          ))
        )}
      </CommandGroup>
    </Command>
  );
}
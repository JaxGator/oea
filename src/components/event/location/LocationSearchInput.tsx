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
  const [searchValue, setSearchValue] = useState<string>(currentValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const { mapToken, isLoading, error } = useMapboxToken();

  useEffect(() => {
    setSearchValue(currentValue);
  }, [currentValue]);

  const searchLocations = async (query: string) => {
    // Reset suggestions if query is too short
    if (!query || query.length < 3 || !mapToken) {
      setSuggestions([]);
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
      const newSuggestions = Array.isArray(data.features) 
        ? data.features.map((feature: any) => ({
            place_name: feature.place_name,
            center: feature.center as [number, number],
          }))
        : [];
      
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error searching locations:', error);
      toast.error('Error searching for locations. Please try again.');
      setSuggestions([]);
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
        {searchValue.length < 3 ? (
          <CommandEmpty>Enter at least 3 characters to search...</CommandEmpty>
        ) : suggestions.length === 0 ? (
          <CommandEmpty>No locations found.</CommandEmpty>
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
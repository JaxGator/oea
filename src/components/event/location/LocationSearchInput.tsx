
import { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { LocationSearchInputProps } from './types/location';
import { SuggestionsList } from './components/SuggestionsList';
import { useLocationSearch } from './hooks/useLocationSearch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function LocationSearchInput({ 
  onLocationSelect, 
  currentValue = '', 
  disabled = false 
}: LocationSearchInputProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mapToken, isLoading, error } = useMapboxToken();
  const [inputValue, setInputValue] = useState(currentValue);
  const { 
    suggestions, 
    isDropdownOpen, 
    setIsDropdownOpen,
    isSearching,
    searchLocations,
    retrieveCoordinates
  } = useLocationSearch(mapToken);

  useEffect(() => {
    if (currentValue && currentValue !== inputValue) {
      setInputValue(currentValue);
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
    // Log token status for debugging
    if (!mapToken) {
      console.log('No Mapbox token available');
    } else {
      console.log('Mapbox token is available');
    }
  }, [mapToken]);

  if (isLoading) {
    return (
      <div className="p-4 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading location search...</span>
      </div>
    );
  }

  if (error || !mapToken) {
    console.error('Location search error:', error);
    return (
      <div className="p-4 text-red-500">
        Error loading location search. Please try refreshing the page.
      </div>
    );
  }

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (value.length >= 3) {
      searchLocations(value);
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleSuggestionSelect = async (suggestion: { place_name: string; mapbox_id: string; center: [number, number] }) => {
    console.log('Selected suggestion:', suggestion);
    
    const coordinates = await retrieveCoordinates(suggestion.mapbox_id);
    if (coordinates) {
      setInputValue(suggestion.place_name);
      onLocationSelect({
        ...suggestion,
        center: coordinates
      });
      setIsDropdownOpen(false);
    } else {
      toast.error('Could not retrieve location coordinates. Please try again.');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Input
          placeholder="Search for a location..."
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          disabled={disabled}
          className="w-full"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      
      <SuggestionsList
        suggestions={suggestions}
        isOpen={isDropdownOpen}
        searchValue={inputValue}
        onSelect={handleSuggestionSelect}
      />
    </div>
  );
}

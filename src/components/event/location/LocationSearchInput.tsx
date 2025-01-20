import { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { LocationSearchInputProps } from './types/location';
import { SuggestionsList } from './components/SuggestionsList';
import { useLocationSearch } from './hooks/useLocationSearch';

export function LocationSearchInput({ 
  onLocationSelect, 
  currentValue = '', 
  disabled = false 
}: LocationSearchInputProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mapToken, isLoading, error } = useMapboxToken();
  const { 
    searchValue, 
    setSearchValue, 
    suggestions, 
    isDropdownOpen, 
    setIsDropdownOpen 
  } = useLocationSearch(mapToken);

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

  if (error) {
    return <div className="p-4 text-red-500">Error loading location search</div>;
  }

  if (isLoading) {
    return <div className="p-4">Loading location search...</div>;
  }

  const handleSuggestionSelect = (suggestion: { place_name: string; center: [number, number] }) => {
    onLocationSelect(suggestion);
    setSearchValue(suggestion.place_name);
    setIsDropdownOpen(false);
  };

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
      
      <SuggestionsList
        suggestions={suggestions}
        isOpen={isDropdownOpen}
        searchValue={searchValue}
        onSelect={handleSuggestionSelect}
      />
    </div>
  );
}
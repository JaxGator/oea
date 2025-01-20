import { LocationSuggestion } from "../types/location";

interface SuggestionsListProps {
  suggestions: LocationSuggestion[];
  isOpen: boolean;
  searchValue: string;
  onSelect: (suggestion: LocationSuggestion) => void;
}

export function SuggestionsList({ 
  suggestions, 
  isOpen, 
  searchValue, 
  onSelect 
}: SuggestionsListProps) {
  if (!isOpen) return null;

  if (suggestions.length === 0 && searchValue.length >= 3) {
    return (
      <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-4 text-center text-gray-500">
        No locations found
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.place_name}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion.place_name}
        </button>
      ))}
    </div>
  );
}
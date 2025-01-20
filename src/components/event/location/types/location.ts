export interface LocationSuggestion {
  place_name: string;
  center: [number, number];
}

export interface LocationSearchInputProps {
  onLocationSelect: (suggestion: LocationSuggestion) => void;
  currentValue?: string;
  disabled?: boolean;
}
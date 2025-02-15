
export interface LocationSuggestion {
  place_name: string;
  mapbox_id: string;
  center: [number, number];
}

export interface LocationSearchInputProps {
  onLocationSelect: (suggestion: LocationSuggestion) => void;
  currentValue?: string;
  disabled?: boolean;
}

export interface RetrieveResponse {
  features: Array<{
    geometry: {
      coordinates: [number, number]; // [longitude, latitude]
    };
    properties: {
      name: string;
      full_address: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
  }>;
}

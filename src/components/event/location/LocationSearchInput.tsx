import { useState, useRef } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface LocationSuggestion {
  place_name: string;
  center: [number, number];
}

interface LocationSearchInputProps {
  onLocationSelect: (suggestion: LocationSuggestion) => void;
  currentValue: string;
}

export function LocationSearchInput({ onLocationSelect, currentValue }: LocationSearchInputProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout>();

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const { data: { token }, error: tokenError } = await supabase.functions.invoke('get-mapbox-token');
      
      if (tokenError) {
        console.error('Error fetching Mapbox token:', tokenError);
        setSuggestions([]);
        return;
      }

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&types=place,address`
      );
      
      if (!response.ok) {
        console.error('Geocoding request failed');
        setSuggestions([]);
        return;
      }
      
      const data = await response.json();
      const newSuggestions = data.features?.map((feature: any) => ({
        place_name: feature.place_name,
        center: feature.center
      })) || [];
      
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Command shouldFilter={false} className="w-full">
      <CommandInput
        placeholder="Search location..."
        value={searchValue}
        onValueChange={(value) => {
          setSearchValue(value);
          if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
          }
          debounceTimer.current = setTimeout(() => {
            fetchSuggestions(value);
          }, 500);
        }}
      />
      {loading ? (
        <CommandEmpty>Loading...</CommandEmpty>
      ) : suggestions.length === 0 ? (
        <CommandEmpty>No location found.</CommandEmpty>
      ) : (
        <CommandGroup>
          {suggestions.map((suggestion) => (
            <CommandItem
              key={suggestion.place_name}
              value={suggestion.place_name}
              onSelect={() => onLocationSelect(suggestion)}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  currentValue === suggestion.place_name ? "opacity-100" : "opacity-0"
                )}
              />
              {suggestion.place_name}
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </Command>
  );
}
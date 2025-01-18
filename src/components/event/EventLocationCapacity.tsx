import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./EventFormTypes";
import { useAdminStatus } from "@/hooks/events/useAdminStatus";
import { useState, useEffect, useRef } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface EventLocationCapacityProps {
  form: UseFormReturn<EventFormValues>;
  disableLocation?: boolean;
  showMaxGuestsHint?: boolean;
}

interface LocationSuggestion {
  place_name: string;
  center: [number, number];
}

export function EventLocationCapacity({ form, disableLocation, showMaxGuestsHint }: EventLocationCapacityProps) {
  const { isAdmin } = useAdminStatus();
  const [open, setOpen] = useState(false);
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

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    form.setValue('location', suggestion.place_name);
    form.setValue('latitude', suggestion.center[1]);
    form.setValue('longitude', suggestion.center[0]);
    setOpen(false);
    setSearchValue("");
  };

  return (
    <>
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Location</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={disableLocation && !isAdmin}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value || "Select a location..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command shouldFilter={false}>
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
                  <CommandEmpty>{loading ? "Loading..." : "No location found."}</CommandEmpty>
                  {suggestions.length > 0 && (
                    <CommandGroup>
                      {suggestions.map((suggestion) => (
                        <CommandItem
                          key={suggestion.place_name}
                          value={suggestion.place_name}
                          onSelect={() => handleLocationSelect(suggestion)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === suggestion.place_name ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {suggestion.place_name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="max_guests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Guests</FormLabel>
            {showMaxGuestsHint && (
              <p className="text-sm text-muted-foreground mb-2">
                {isAdmin 
                  ? "As an admin, you can adjust this number to match the actual attendance for this past event."
                  : "This number reflects the maximum guest capacity for this past event."
                }
              </p>
            )}
            <FormControl>
              <Input 
                type="number" 
                min="1" 
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                value={field.value || ""}
                disabled={showMaxGuestsHint && !isAdmin}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
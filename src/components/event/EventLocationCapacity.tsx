import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./EventFormTypes";
import { useAdminStatus } from "@/hooks/events/useAdminStatus";
import { useEffect, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMapboxToken } from "@/hooks/useMapboxToken";
import { useQuery } from "@tanstack/react-query";

interface EventLocationCapacityProps {
  form: UseFormReturn<EventFormValues>;
  disableLocation?: boolean;
  showMaxGuestsHint?: boolean;
}

interface MapboxFeature {
  place_name: string;
  center: [number, number];
}

export function EventLocationCapacity({ form, disableLocation, showMaxGuestsHint }: EventLocationCapacityProps) {
  const { isAdmin } = useAdminStatus();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { mapToken } = useMapboxToken();

  const { data: predictions = [], isLoading } = useQuery({
    queryKey: ['locationPredictions', searchValue],
    queryFn: async () => {
      if (!searchValue || !mapToken) return [];
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchValue)}.json?access_token=${mapToken}&types=place,address`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      
      const data = await response.json();
      return (data.features || []) as MapboxFeature[];
    },
    enabled: !!searchValue && !!mapToken,
  });

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
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Search for a location..."
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setSearchValue(e.target.value);
                      }}
                      disabled={disableLocation && !isAdmin}
                      className={cn(
                        "w-full",
                        !field.value && "text-muted-foreground"
                      )}
                    />
                    <ChevronsUpDown className="absolute right-2 top-2.5 h-4 w-4 opacity-50" />
                  </div>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search for a location..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandEmpty>
                    {isLoading ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      "No locations found."
                    )}
                  </CommandEmpty>
                  {predictions.length > 0 && (
                    <CommandGroup>
                      {predictions.map((prediction) => (
                        <CommandItem
                          key={prediction.place_name}
                          value={prediction.place_name}
                          onSelect={() => {
                            field.onChange(prediction.place_name);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === prediction.place_name
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {prediction.place_name}
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
                value={field.value}
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
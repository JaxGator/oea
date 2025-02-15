
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./EventFormTypes";
import { useAdminStatus } from "@/hooks/events/useAdminStatus";
import { Input } from "@/components/ui/input";
import { LocationSearchInput } from "./location/LocationSearchInput";

interface EventLocationCapacityProps {
  form: UseFormReturn<EventFormValues>;
  disableLocation?: boolean;
  showMaxGuestsHint?: boolean;
}

export function EventLocationCapacity({ 
  form, 
  disableLocation, 
  showMaxGuestsHint 
}: EventLocationCapacityProps) {
  const { isAdmin } = useAdminStatus();

  return (
    <>
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Location</FormLabel>
            <LocationSearchInput 
              onLocationSelect={(suggestion) => {
                field.onChange(suggestion.place_name);
                form.setValue('latitude', suggestion.center[1]);
                form.setValue('longitude', suggestion.center[0]);
              }}
              currentValue={field.value}
              disabled={disableLocation && !isAdmin}
            />
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
            <Input
              type="number"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
              disabled={showMaxGuestsHint && !isAdmin}
              min={1}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./EventFormTypes";

interface EventLocationCapacityProps {
  form: UseFormReturn<EventFormValues>;
  disableLocation?: boolean;
  showMaxGuestsHint?: boolean;
}

export function EventLocationCapacity({ form, disableLocation, showMaxGuestsHint }: EventLocationCapacityProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input 
                placeholder="Event location" 
                {...field} 
                disabled={disableLocation}
              />
            </FormControl>
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
                You can adjust this number to match the actual attendance for this past event.
              </p>
            )}
            <FormControl>
              <Input 
                type="number" 
                min="1" 
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
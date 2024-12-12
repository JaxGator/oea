import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./EventFormTypes";

interface EventLocationCapacityProps {
  form: UseFormReturn<EventFormValues>;
}

export function EventLocationCapacity({ form }: EventLocationCapacityProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="Event location" {...field} />
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
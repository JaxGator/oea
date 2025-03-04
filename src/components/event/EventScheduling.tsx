
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./EventFormTypes";

interface EventSchedulingProps {
  form: UseFormReturn<EventFormValues>;
  disabled?: boolean;
}

export function EventScheduling({ form, disabled }: EventSchedulingProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                {...field} 
                disabled={disabled} 
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Time</FormLabel>
            <FormControl>
              <Input 
                type="time" 
                {...field} 
                disabled={disabled} 
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="end_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Time (Optional)</FormLabel>
            <FormControl>
              <Input 
                type="time" 
                {...field} 
                disabled={disabled} 
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./EventFormTypes";

interface EventSchedulingProps {
  form: UseFormReturn<EventFormValues>;
}

export function EventScheduling({ form }: EventSchedulingProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
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
            <FormLabel>Time</FormLabel>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
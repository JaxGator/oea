import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./EventFormTypes";
import { useAdminStatus } from "@/hooks/events/useAdminStatus";

interface EventLocationCapacityProps {
  form: UseFormReturn<EventFormValues>;
  disableLocation?: boolean;
  showMaxGuestsHint?: boolean;
}

export function EventLocationCapacity({ form, disableLocation, showMaxGuestsHint }: EventLocationCapacityProps) {
  const { isAdmin } = useAdminStatus();

  return (
    <>
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter venue location"
                {...field}
                disabled={disableLocation && !isAdmin}
                className="w-full"
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

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./EventFormTypes";

interface EventWaitlistSettingsProps {
  form: UseFormReturn<EventFormValues>;
  disabled?: boolean;
}

export function EventWaitlistSettings({ form, disabled }: EventWaitlistSettingsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="waitlist_enabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Enable Waitlist</FormLabel>
              <FormDescription>
                Allow users to join a waitlist when the event is full
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value || false}
                onCheckedChange={(checked) => {
                  console.log("Waitlist switch changed:", checked);
                  field.onChange(checked);
                }}
                disabled={disabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {form.watch("waitlist_enabled") && (
        <FormField
          control={form.control}
          name="waitlist_capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Waitlist Capacity (Optional)</FormLabel>
              <FormDescription>
                Maximum number of people allowed on the waitlist. Leave empty for unlimited.
              </FormDescription>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : null;
                    field.onChange(value);
                  }}
                  value={field.value || ""}
                  disabled={disabled}
                  placeholder="Unlimited"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}

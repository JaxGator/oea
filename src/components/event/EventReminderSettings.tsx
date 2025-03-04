
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./EventFormTypes";

interface EventReminderSettingsProps {
  form: UseFormReturn<EventFormValues>;
  disabled?: boolean;
}

export function EventReminderSettings({ form, disabled }: EventReminderSettingsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="reminder_enabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Event Reminders</FormLabel>
              <FormDescription>
                Send automated reminders to attendees before the event
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value || false}
                onCheckedChange={(checked) => {
                  console.log("Reminder switch changed:", checked);
                  field.onChange(checked);
                }}
                disabled={disabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}


import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../EventFormTypes";

interface EventFormAdminSectionProps {
  form: UseFormReturn<EventFormValues>;
  isAdmin: boolean;
}

export function EventFormAdminSection({ form, isAdmin }: EventFormAdminSectionProps) {
  if (!isAdmin) return null;
  
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="is_featured"
        checked={form.watch("is_featured")}
        onCheckedChange={(checked) => form.setValue("is_featured", checked)}
      />
      <Label htmlFor="is_featured">Feature this event</Label>
    </div>
  );
}

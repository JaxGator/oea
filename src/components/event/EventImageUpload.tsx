import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./EventFormTypes";

interface EventImageUploadProps {
  form: UseFormReturn<EventFormValues>;
  defaultImage?: string;
}

export function EventImageUpload({ form, defaultImage }: EventImageUploadProps) {
  return (
    <FormField
      control={form.control}
      name="image_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Event Image</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <Input
                type="url"
                placeholder="Image URL"
                {...field}
                className="mb-2"
              />
              {(field.value || defaultImage) && (
                <img
                  src={field.value || defaultImage}
                  alt="Event preview"
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
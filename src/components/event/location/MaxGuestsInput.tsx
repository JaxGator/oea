import { FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../EventFormTypes";

interface MaxGuestsInputProps {
  form: UseFormReturn<EventFormValues>;
  showHint?: boolean;
  isAdmin: boolean;
  disabled?: boolean;
}

export function MaxGuestsInput({ form, showHint, isAdmin, disabled }: MaxGuestsInputProps) {
  return (
    <>
      {showHint && (
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
          {...form.register("max_guests", { 
            valueAsNumber: true,
            onChange: (e) => form.setValue("max_guests", parseInt(e.target.value))
          })}
          value={form.watch("max_guests") || ""}
          disabled={disabled && !isAdmin}
        />
      </FormControl>
      <FormMessage />
    </>
  );
}
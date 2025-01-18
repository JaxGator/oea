import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./EventFormTypes";
import { useAdminStatus } from "@/hooks/events/useAdminStatus";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LocationSearchInput } from "./location/LocationSearchInput";
import { MaxGuestsInput } from "./location/MaxGuestsInput";

interface EventLocationCapacityProps {
  form: UseFormReturn<EventFormValues>;
  disableLocation?: boolean;
  showMaxGuestsHint?: boolean;
}

export function EventLocationCapacity({ 
  form, 
  disableLocation, 
  showMaxGuestsHint 
}: EventLocationCapacityProps) {
  const { isAdmin } = useAdminStatus();
  const [open, setOpen] = useState(false);

  const handleLocationSelect = (suggestion: { place_name: string; center: [number, number] }) => {
    console.log('Location selected:', suggestion);
    form.setValue('location', suggestion.place_name);
    form.setValue('latitude', suggestion.center[1]);
    form.setValue('longitude', suggestion.center[0]);
    setOpen(false);
  };

  return (
    <>
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Location</FormLabel>
            <Popover 
              open={open} 
              onOpenChange={setOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={disableLocation && !isAdmin}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value || "Select a location..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <LocationSearchInput 
                  onLocationSelect={handleLocationSelect}
                  currentValue={field.value}
                />
              </PopoverContent>
            </Popover>
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
            <MaxGuestsInput 
              form={form}
              showHint={showMaxGuestsHint}
              isAdmin={isAdmin}
              disabled={showMaxGuestsHint}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
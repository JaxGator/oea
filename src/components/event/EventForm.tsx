import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormProps, EventFormValues, eventSchema } from "./EventFormTypes";
import { EventBasicDetails } from "./EventBasicDetails";
import { EventScheduling } from "./EventScheduling";
import { EventLocationCapacity } from "./EventLocationCapacity";
import { EventImageUpload } from "./EventImageUpload";
import { EventReminderSettings } from "./EventReminderSettings";
import { useEventFormSubmit } from "@/hooks/useEventFormSubmit";

export function EventForm({ onSuccess, initialData, isPastEvent, isWixEvent }: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      max_guests: 50,
      image_url: "/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png",
      reminder_enabled: false,
      reminder_intervals: ["7d", "1d", "1h"],
    },
  });

  const { handleSubmit: handleFormSubmit } = useEventFormSubmit(onSuccess);

  const onSubmit = async (data: EventFormValues) => {
    await handleFormSubmit(data, initialData);
    if (!initialData) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <EventBasicDetails form={form} />
        <EventScheduling form={form} disabled={isPastEvent} />
        <EventLocationCapacity 
          form={form} 
          disableLocation={isPastEvent}
          showMaxGuestsHint={isPastEvent}
        />
        <EventImageUpload form={form} defaultImage={initialData?.image_url} />
        <EventReminderSettings form={form} disabled={isPastEvent} />
        <Button type="submit" className="w-full bg-[#0d97d1] hover:bg-[#0d97d1]/90">
          {initialData ? "Update Event" : "Create Event"}
        </Button>
      </form>
    </Form>
  );
}
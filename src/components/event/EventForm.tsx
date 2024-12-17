import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormProps, EventFormValues, eventSchema } from "./EventFormTypes";
import { EventBasicDetails } from "./EventBasicDetails";
import { EventScheduling } from "./EventScheduling";
import { EventLocationCapacity } from "./EventLocationCapacity";
import { EventImageUpload } from "./EventImageUpload";
import { useEventFormSubmit } from "@/hooks/useEventFormSubmit";

export function EventForm({ onSuccess, initialData }: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      max_guests: 50,
      image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
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
        <EventScheduling form={form} />
        <EventLocationCapacity form={form} />
        <EventImageUpload form={form} defaultImage={initialData?.image_url} />
        <Button type="submit" className="w-full bg-[#0d97d1] hover:bg-[#0d97d1]/90">
          {initialData ? "Update Event" : "Create Event"}
        </Button>
      </form>
    </Form>
  );
}
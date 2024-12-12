import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { EventFormProps, EventFormValues, eventSchema } from "./EventFormTypes";
import { EventBasicDetails } from "./EventBasicDetails";
import { EventScheduling } from "./EventScheduling";
import { EventLocationCapacity } from "./EventLocationCapacity";
import { EventImageUpload } from "./EventImageUpload";

export function EventForm({ onSuccess, initialData }: EventFormProps) {
  const { toast } = useToast();
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

  const onSubmit = async (data: EventFormValues) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to manage events",
          variant: "destructive",
        });
        return;
      }

      if (initialData) {
        const { error } = await supabase
          .from("events")
          .update({
            title: data.title,
            description: data.description,
            date: data.date,
            time: data.time,
            location: data.location,
            max_guests: data.max_guests,
            image_url: data.image_url,
          })
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Event updated successfully",
        });
      } else {
        const { error } = await supabase.from("events").insert({
          title: data.title,
          description: data.description,
          date: data.date,
          time: data.time,
          location: data.location,
          max_guests: data.max_guests,
          created_by: user.id,
          image_url: data.image_url,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Event created successfully",
        });
      }
      
      onSuccess();
      form.reset();
    } catch (error) {
      console.error("Error managing event:", error);
      toast({
        title: "Error",
        description: "Failed to manage event. Please try again.",
        variant: "destructive",
      });
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
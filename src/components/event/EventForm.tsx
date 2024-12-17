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
import { useNavigate } from "react-router-dom";

export function EventForm({ onSuccess, initialData }: EventFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
        navigate("/auth");
        return;
      }

      // Check if user has a profile and is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, is_admin')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        toast({
          title: "Error",
          description: "Please complete your profile before managing events",
          variant: "destructive",
        });
        navigate("/profile");
        return;
      }

      if (!profile.is_admin) {
        toast({
          title: "Error",
          description: "Only admins can manage events",
          variant: "destructive",
        });
        return;
      }

      const eventData = {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        max_guests: data.max_guests,
        image_url: data.image_url,
      };

      if (initialData?.id) {
        // Update existing event
        const { error: updateError } = await supabase
          .from("events")
          .update(eventData)
          .eq("id", initialData.id);

        if (updateError) throw updateError;

        toast({
          title: "Success",
          description: "Event updated successfully",
        });
      } else {
        // Create new event
        const { error: createError } = await supabase
          .from("events")
          .insert({
            ...eventData,
            created_by: user.id,
          });

        if (createError) throw createError;

        toast({
          title: "Success",
          description: "Event created successfully",
        });
      }
      
      onSuccess();
      if (!initialData) {
        form.reset();
      }
    } catch (error: any) {
      console.error("Error managing event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to manage event. Please try again.",
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { EventFormValues } from "@/components/event/EventFormTypes";

export const useEventFormSubmit = (onSuccess: () => void) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (data: EventFormValues, initialData?: { id: string }) => {
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
        reminder_enabled: data.reminder_enabled,
        reminder_intervals: data.reminder_intervals,
        waitlist_enabled: data.waitlist_enabled,
        waitlist_capacity: data.waitlist_capacity,
        is_featured: data.is_featured
      };

      if (initialData?.id) {
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
    } catch (error: any) {
      console.error("Error managing event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to manage event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
};
import { supabase } from "@/integrations/supabase/client";
import { EventFormValues } from "@/components/event/EventFormTypes";
import { toast } from "@/hooks/use-toast";

export const validateUserPermissions = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    toast({
      title: "Error",
      description: "You must be logged in to manage events",
      variant: "destructive",
    });
    return null;
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
    return null;
  }

  if (!profile.is_admin) {
    toast({
      title: "Error",
      description: "Only admins can manage events",
      variant: "destructive",
    });
    return null;
  }

  return profile;
};

export const createEventData = (data: EventFormValues) => ({
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
});

export const updateEvent = async (eventId: string, eventData: ReturnType<typeof createEventData>) => {
  const { error } = await supabase
    .from("events")
    .update(eventData)
    .eq("id", eventId);

  if (error) throw error;
  
  toast({
    title: "Success",
    description: "Event updated successfully",
  });
};

export const createEvent = async (eventData: ReturnType<typeof createEventData>, userId: string) => {
  const { error } = await supabase
    .from("events")
    .insert({
      ...eventData,
      created_by: userId,
    });

  if (error) throw error;
  
  toast({
    title: "Success",
    description: "Event created successfully",
  });
};
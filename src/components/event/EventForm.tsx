
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
import { EventWaitlistSettings } from "./EventWaitlistSettings";
import { useEventFormSubmit } from "@/hooks/useEventFormSubmit";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAdminStatus } from "@/hooks/events/useAdminStatus";
import { useAuthState } from "@/hooks/useAuthState";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function EventForm({ onSuccess, initialData, isPastEvent, isWixEvent }: EventFormProps) {
  const { isAdmin, canManageEvents } = useAdminStatus();
  const { user } = useAuthState();
  const [localSubmitting, setLocalSubmitting] = useState(false);
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    mode: "onBlur", // Change to onBlur to validate fields as user tabs away
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      date: initialData?.date || "",
      time: initialData?.time || "",
      end_time: initialData?.end_time || "",
      location: initialData?.location || "",
      max_guests: initialData?.max_guests || 50,
      image_url: initialData?.image_url || "/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png",
      reminder_enabled: initialData?.reminder_enabled || false,
      reminder_intervals: initialData?.reminder_intervals || ["7d", "1d", "1h"],
      waitlist_enabled: initialData?.waitlist_enabled || false,
      waitlist_capacity: initialData?.waitlist_capacity || null,
      is_featured: initialData?.is_featured || false,
      latitude: initialData?.latitude || null,
      longitude: initialData?.longitude || null,
      created_by: initialData?.created_by || user?.id || "",
    }
  });

  // Make sure created_by is set when user loads
  useEffect(() => {
    if (user?.id && !form.getValues('created_by')) {
      form.setValue('created_by', user.id);
    }
  }, [user, form]);

  const { handleSubmit: handleFormSubmit, isSubmitting } = useEventFormSubmit(onSuccess);

  const onSubmit = async (data: EventFormValues) => {
    if (!user?.id) {
      console.error('No user ID available');
      toast.error('You must be logged in to create an event');
      return;
    }
    
    // Prevent multiple submissions
    if (localSubmitting || isSubmitting) {
      console.log('Submission already in progress, ignoring duplicate submit');
      return;
    }
    
    setLocalSubmitting(true);
    
    try {
      console.log('EventForm - Submitting form with data:', { 
        ...data,
        userId: user.id,
        isAdmin,
        canManageEvents,
        isEditing: !!initialData,
        eventCreator: initialData?.created_by,
        isCreator: initialData?.created_by === user.id
      });
      
      const eventData = {
        ...data,
        created_by: initialData?.created_by || user.id,
      };
      
      await handleFormSubmit(eventData, initialData);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to save event. Please try again.');
    } finally {
      setLocalSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <EventBasicDetails form={form} />
        <EventScheduling form={form} disabled={isPastEvent} />
        <EventLocationCapacity 
          form={form} 
          disableLocation={isPastEvent}
          showMaxGuestsHint={isPastEvent}
        />
        <EventImageUpload form={form} defaultImage={initialData?.image_url} />
        <EventReminderSettings form={form} disabled={isPastEvent} />
        <EventWaitlistSettings form={form} disabled={isPastEvent} />
        
        {isAdmin && (
          <div className="flex items-center space-x-2">
            <Switch
              id="is_featured"
              checked={form.watch("is_featured")}
              onCheckedChange={(checked) => form.setValue("is_featured", checked)}
            />
            <Label htmlFor="is_featured">Feature this event</Label>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-[#0d97d1] hover:bg-[#0d97d1]/90"
          disabled={localSubmitting || isSubmitting}
        >
          {localSubmitting || isSubmitting ? 
            (initialData ? "Updating Event..." : "Creating Event...") : 
            (initialData ? "Update Event" : "Create Event")}
        </Button>
      </form>
    </Form>
  );
}

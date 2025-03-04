import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormProps, EventFormValues, eventSchema } from "../EventFormTypes";
import { EventBasicDetails } from "../EventBasicDetails";
import { EventScheduling } from "../EventScheduling";
import { EventLocationCapacity } from "../EventLocationCapacity";
import { EventImageUpload } from "../EventImageUpload";
import { EventReminderSettings } from "../EventReminderSettings";
import { EventWaitlistSettings } from "../EventWaitlistSettings";
import { useEventFormSubmit } from "@/hooks/useEventFormSubmit";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAdminStatus } from "@/hooks/events/useAdminStatus";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/auth";

interface EventFormContentProps extends EventFormProps {
  hasPermissionToEdit: boolean;
  user: Profile | null;
  forceAdmin?: boolean;
  forceCanManage?: boolean;
}

export function EventFormContent({ 
  onSuccess, 
  initialData, 
  isPastEvent, 
  isWixEvent, 
  hasPermissionToEdit,
  user,
  forceAdmin,
  forceCanManage
}: EventFormContentProps) {
  const { isAdmin } = useAdminStatus();
  const [localSubmitting, setLocalSubmitting] = useState(false);
  
  const effectiveIsAdmin = isAdmin || forceAdmin || !!user?.is_admin;
  const effectiveCanManage = effectiveIsAdmin || forceCanManage || !!user?.is_approved || !!user?.is_member;
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    mode: "onBlur",
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

  useEffect(() => {
    if (user?.id) {
      if (initialData?.id && initialData?.created_by) {
        console.log("Preserving original event creator:", initialData.created_by);
        form.setValue('created_by', initialData.created_by);
      } else if (!form.getValues('created_by')) {
        console.log("Setting current user as event creator:", user.id);
        form.setValue('created_by', user.id);
      }
    }
  }, [user, form, initialData]);

  const { handleSubmit: handleFormSubmit, isSubmitting } = useEventFormSubmit(onSuccess);

  useEffect(() => {
    console.log("EventFormContent - Admin status:", {
      hookIsAdmin: isAdmin,
      forceAdmin,
      effectiveIsAdmin,
      userIsAdmin: user?.is_admin,
      userIsMember: user?.is_member,
      userIsApproved: user?.is_approved,
      hasPermissionToEdit,
      timestamp: new Date().toISOString()
    });
  }, [isAdmin, forceAdmin, effectiveIsAdmin, user?.is_admin, user?.is_member, user?.is_approved, hasPermissionToEdit]);

  const onSubmit = async (data: EventFormValues) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const hasValidSession = !!sessionData.session;
      
      console.log("Form submission - Session check:", {
        hasValidSession,
        userId: sessionData.session?.user?.id,
        timestamp: new Date().toISOString()
      });
      
      if (!hasValidSession) {
        console.error('Not authenticated while submitting form - direct check');
        toast.error('You must be logged in to create or edit events');
        return;
      }
      
      const userId = user?.id || sessionData.session?.user?.id;
      
      if (!userId) {
        console.error('No user ID available');
        toast.error('You must be logged in to create an event');
        return;
      }
      
      const isAdmin = !!user?.is_admin || forceAdmin;
      const isMember = !!user?.is_member;
      const isApproved = !!user?.is_approved;
      
      const canManageEvents = isAdmin || isMember || isApproved || forceCanManage;
      
      console.log("Form submission - Permission check:", {
        isAdmin,
        isMember,
        isApproved,
        forceAdmin,
        forceCanManage,
        canManageEvents,
        hasPermissionToEdit
      });
      
      if (initialData?.id && !hasPermissionToEdit && !canManageEvents) {
        toast.error('You do not have permission to edit this event');
        return;
      }
      
      if (localSubmitting || isSubmitting) {
        console.log('Submission already in progress, ignoring duplicate submit');
        return;
      }
      
      setLocalSubmitting(true);
      
      console.log('EventForm - Submitting form with data:', { 
        ...data,
        userId,
        isAdmin: effectiveIsAdmin,
        canManageEvents: effectiveCanManage,
        isEditing: !!initialData,
        eventCreator: initialData?.created_by,
        isCreator: initialData?.created_by === userId
      });
      
      const eventData = {
        ...data,
        created_by: initialData?.id ? (initialData.created_by || userId) : userId,
      };
      
      console.log("Final event data:", eventData);
      
      await handleFormSubmit(eventData, initialData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLocalSubmitting(false);
    }
  };

  const showPermissionWarning = initialData?.id && !hasPermissionToEdit && 
    !(!!user?.is_admin || !!user?.is_member || !!user?.is_approved || forceAdmin || forceCanManage);

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
        
        {effectiveIsAdmin && (
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
          disabled={localSubmitting || isSubmitting || showPermissionWarning}
        >
          {localSubmitting || isSubmitting ? 
            (initialData ? "Updating Event..." : "Creating Event...") : 
            (initialData ? "Update Event" : "Create Event")}
        </Button>
      </form>
    </Form>
  );
}

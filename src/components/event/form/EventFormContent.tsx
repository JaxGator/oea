import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormProps, EventFormValues, eventSchema } from "../EventFormTypes";
import { EventBasicDetails } from "../EventBasicDetails";
import { EventScheduling } from "../EventScheduling";
import { EventLocationCapacity } from "../EventLocationCapacity";
import { EventImageUpload } from "../EventImageUpload";
import { EventReminderSettings } from "../EventReminderSettings";
import { EventWaitlistSettings } from "../EventWaitlistSettings";
import { useEffect } from "react";
import type { Profile } from "@/types/auth";
import { EventFormAdminSection } from "./EventFormAdminSection";
import { EventFormSubmitButton } from "./EventFormSubmitButton";
import { useEventFormSubmission } from "@/hooks/events/useEventFormSubmission";

interface EventFormContentProps extends EventFormProps {
  hasPermissionToEdit: boolean;
  user: Profile | null;
  forceAdmin?: boolean;
  forceCanManage?: boolean;
  isVerifyingPermission?: boolean;
}

export function EventFormContent({ 
  onSuccess, 
  initialData, 
  isPastEvent, 
  isWixEvent, 
  hasPermissionToEdit,
  user,
  forceAdmin,
  forceCanManage,
  isVerifyingPermission = false
}: EventFormContentProps) {
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

  const { 
    onSubmit, 
    isSubmitting, 
    effectiveIsAdmin, 
    effectiveCanManage 
  } = useEventFormSubmission({
    onSuccess,
    initialData,
    user,
    hasPermissionToEdit,
    forceAdmin,
    forceCanManage
  });

  const showPermissionWarning = initialData?.id && !hasPermissionToEdit && 
    !effectiveCanManage;

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
        
        <EventFormAdminSection 
          form={form} 
          isAdmin={effectiveIsAdmin} 
        />

        <EventFormSubmitButton 
          isSubmitting={isSubmitting}
          isVerifyingPermission={isVerifyingPermission}
          initialData={initialData}
          showPermissionWarning={showPermissionWarning}
        />
      </form>
    </Form>
  );
}

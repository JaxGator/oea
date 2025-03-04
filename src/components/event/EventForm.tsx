
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function EventForm({ onSuccess, initialData, isPastEvent, isWixEvent }: EventFormProps) {
  const { isAdmin, canManageEvents, isLoading: checkingAdminStatus } = useAdminStatus();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthState();
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const [hasPermissionToEdit, setHasPermissionToEdit] = useState(true);
  const [verifyingSession, setVerifyingSession] = useState(true);
  const [sessionConfirmed, setSessionConfirmed] = useState(false);
  
  // Direct session check
  useEffect(() => {
    const checkSession = async () => {
      try {
        setVerifyingSession(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          return;
        }
        
        const hasSession = !!data.session;
        setSessionConfirmed(hasSession);
        
        console.log("EventForm - Direct session check:", {
          hasSession,
          sessionId: data.session?.id,
          userId: data.session?.user?.id,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setVerifyingSession(false);
      }
    };
    
    checkSession();
  }, []);
  
  // Log authentication status for debugging
  useEffect(() => {
    console.log('EventForm - Auth status:', {
      isAuthenticated,
      userId: user?.id,
      isAdmin: user?.is_admin,
      isApproved: user?.is_approved,
      sessionConfirmed,
      verifyingSession,
      authLoading
    });
  }, [user, isAuthenticated, sessionConfirmed, verifyingSession, authLoading]);
  
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

  // Check permissions for editing events
  useEffect(() => {
    if (initialData?.id && user?.id) {
      const isCreator = initialData.created_by === user.id;
      const canEdit = isAdmin || canManageEvents || isCreator;
      
      setHasPermissionToEdit(canEdit);
      
      if (!canEdit) {
        console.warn("User does not have permission to edit this event", {
          userId: user.id,
          eventCreator: initialData.created_by,
          isAdmin,
          canManageEvents
        });
      }
    }
  }, [initialData, user, isAdmin, canManageEvents]);

  // Make sure created_by is set when user loads
  useEffect(() => {
    if (user?.id && !form.getValues('created_by')) {
      form.setValue('created_by', user.id);
    }
  }, [user, form]);

  const { handleSubmit: handleFormSubmit, isSubmitting } = useEventFormSubmit(onSuccess);

  const onSubmit = async (data: EventFormValues) => {
    // Perform a direct session check before proceeding
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const hasValidSession = !!sessionData.session;
      
      console.log("Form submission - Session check:", {
        hasValidSession,
        sessionId: sessionData.session?.id,
        userId: sessionData.session?.user?.id,
        timestamp: new Date().toISOString()
      });
      
      if (!hasValidSession) {
        console.error('Not authenticated while submitting form - direct check');
        toast.error('You must be logged in to create or edit events');
        return;
      }
      
      // Check normal auth state too
      if (!isAuthenticated) {
        console.error('Not authenticated while submitting form - state check');
        toast.error('You must be logged in to create or edit events');
        return;
      }
      
      if (!user?.id) {
        console.error('No user ID available');
        toast.error('You must be logged in to create an event');
        return;
      }
      
      // For editing events, check permissions first
      if (initialData?.id && !hasPermissionToEdit) {
        toast.error('You do not have permission to edit this event');
        return;
      }
      
      // Prevent multiple submissions
      if (localSubmitting || isSubmitting) {
        console.log('Submission already in progress, ignoring duplicate submit');
        return;
      }
      
      setLocalSubmitting(true);
      
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
    } finally {
      setLocalSubmitting(false);
    }
  };

  // Loading state while verifying session
  if (verifyingSession || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500">Verifying your session...</p>
      </div>
    );
  }

  // Authentication warning state
  if (!isAuthenticated || !sessionConfirmed) {
    return (
      <Alert className="border-red-500 text-red-800 bg-red-50">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          You must be logged in to create or edit events. Please sign in and try again.
        </AlertDescription>
      </Alert>
    );
  }

  // Show permission warning for edit operations
  const showPermissionWarning = initialData?.id && !hasPermissionToEdit;

  if (showPermissionWarning) {
    return (
      <Alert className="border-yellow-500 text-yellow-800 bg-yellow-50">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          You do not have permission to edit this event. Only the event creator, administrators, 
          or approved members can make changes.
        </AlertDescription>
      </Alert>
    );
  }

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
          disabled={localSubmitting || isSubmitting || showPermissionWarning || !isAuthenticated || !sessionConfirmed}
        >
          {localSubmitting || isSubmitting ? 
            (initialData ? "Updating Event..." : "Creating Event...") : 
            (initialData ? "Update Event" : "Create Event")}
        </Button>
      </form>
    </Form>
  );
}

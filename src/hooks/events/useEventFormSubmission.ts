
import { useState, useEffect } from "react";
import { EventFormValues } from "@/components/event/EventFormTypes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEventFormSubmit } from "@/hooks/useEventFormSubmit";
import type { Profile } from "@/types/auth";
import { usePermissions } from "@/hooks/usePermissions";

interface FormSubmissionProps {
  onSuccess: () => void;
  initialData?: any;
  user: Profile | null;
  hasPermissionToEdit: boolean;
  forceAdmin?: boolean;
  forceCanManage?: boolean;
}

export function useEventFormSubmission({
  onSuccess,
  initialData,
  user,
  hasPermissionToEdit,
  forceAdmin,
  forceCanManage
}: FormSubmissionProps) {
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const { handleSubmit: handleFormSubmit, isSubmitting } = useEventFormSubmit(onSuccess);
  const { getEffectivePermissions } = usePermissions();
  
  // Get synchronous permissions
  const { isAdmin, canManageEvents } = getEffectivePermissions();
  
  // Apply force overrides
  const effectiveIsAdmin = isAdmin || !!forceAdmin;
  const effectiveCanManage = effectiveIsAdmin || canManageEvents || !!forceCanManage;
  
  const onSubmit = async (data: EventFormValues) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const hasValidSession = !!sessionData.session;
      
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
      
      // CRITICAL: Always let admins and members bypass permission checks
      if (initialData?.id && !hasPermissionToEdit && !effectiveCanManage) {
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

  return {
    onSubmit,
    isSubmitting: localSubmitting || isSubmitting,
    effectiveIsAdmin,
    effectiveCanManage
  };
}

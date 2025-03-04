
import { useState, useEffect } from "react";
import { EventFormValues } from "@/components/event/EventFormTypes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEventFormSubmit } from "@/hooks/useEventFormSubmit";
import type { Profile } from "@/types/auth";
import { usePermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const { handleSubmit: handleFormSubmit, isSubmitting } = useEventFormSubmit(onSuccess);
  const { getEffectivePermissions, showPermissionDeniedToast } = usePermissions();
  
  // Get synchronous permissions
  const { isAdmin, canManageEvents } = getEffectivePermissions();
  
  // Apply force overrides
  const effectiveIsAdmin = isAdmin || !!forceAdmin;
  const effectiveCanManage = effectiveIsAdmin || canManageEvents || !!forceCanManage;
  
  // Clear permission error when component mounts or permissions change
  useEffect(() => {
    setPermissionError(null);
  }, [effectiveIsAdmin, effectiveCanManage, hasPermissionToEdit]);
  
  const onSubmit = async (data: EventFormValues) => {
    try {
      // Clear any previous errors
      setPermissionError(null);
      
      const { data: sessionData } = await supabase.auth.getSession();
      const hasValidSession = !!sessionData.session;
      
      if (!hasValidSession) {
        console.error('Not authenticated while submitting form - direct check');
        setPermissionError('You must be logged in to create or edit events');
        toast.error('You must be logged in to create or edit events');
        return;
      }
      
      const userId = user?.id || sessionData.session?.user?.id;
      
      if (!userId) {
        console.error('No user ID available');
        setPermissionError('Unable to identify your account. Please try logging in again.');
        toast.error('Unable to identify your account. Please try logging in again.');
        return;
      }
      
      // CRITICAL: Always let admins and members bypass permission checks
      if (initialData?.id && !hasPermissionToEdit && !effectiveCanManage) {
        const errorMessage = 'You do not have permission to edit this event';
        setPermissionError(errorMessage);
        toast.error(errorMessage);
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
    } catch (error: any) {
      console.error('Form submission error:', error);
      const errorMessage = error.message || 'An error occurred while submitting the form';
      setPermissionError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLocalSubmitting(false);
    }
  };

  return {
    onSubmit,
    isSubmitting: localSubmitting || isSubmitting,
    effectiveIsAdmin,
    effectiveCanManage,
    permissionError
  };
}

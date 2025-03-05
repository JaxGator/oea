
import { useState, useEffect } from "react";
import { EventFormValues } from "@/components/event/EventFormTypes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEventFormSubmit } from "@/hooks/useEventFormSubmit";
import type { Profile } from "@/types/auth";

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
  
  // CRITICAL: Always consider forced admin status or user admin status
  const effectiveIsAdmin = forceAdmin || !!user?.is_admin;
  const effectiveCanManage = effectiveIsAdmin || forceCanManage || !!user?.is_approved || !!user?.is_member;
  
  // For debugging purposes
  useEffect(() => {
    console.log("EventFormSubmission - Admin status:", {
      forceAdmin,
      effectiveIsAdmin,
      userIsAdmin: user?.is_admin,
      userIsMember: user?.is_member,
      userIsApproved: user?.is_approved,
      hasPermissionToEdit,
      timestamp: new Date().toISOString()
    });
  }, [forceAdmin, effectiveIsAdmin, user?.is_admin, user?.is_member, user?.is_approved, hasPermissionToEdit]);
  
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
      
      // CRITICAL: Ensure admin status checks are accurate
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
      
      // CRITICAL FIX: Always let admins and members bypass permission checks
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

  return {
    onSubmit,
    isSubmitting: localSubmitting || isSubmitting,
    effectiveIsAdmin,
    effectiveCanManage
  };
}

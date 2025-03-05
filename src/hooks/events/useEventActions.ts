
import { useCallback } from "react";
import { useActionFeedback } from "@/hooks/ui/useActionFeedback";
import { toast } from "sonner";
import { useAuthState } from "@/hooks/useAuthState";
import { PermissionService } from "@/services/permissions/permissionService";

interface EventActionsProps {
  eventId: string;
  createdBy: string;
  onSuccess?: () => void;
}

export function useEventActions({ eventId, createdBy, onSuccess }: EventActionsProps) {
  const { user } = useAuthState();
  const { executeAction, isLoading } = useActionFeedback();
  
  // Handle RSVP action with proper feedback
  const handleRSVP = useCallback(async (guests?: { firstName: string }[]) => {
    return executeAction(
      async () => {
        // Session check
        const sessionCheck = await PermissionService.verifySession();
        if (!sessionCheck.isValid) {
          throw new Error("Please sign in to RSVP for this event");
        }
        
        // Normally you would call your RSVP service here
        console.log("RSVP with guests:", guests);
        
        // Simulate a successful RSVP
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (onSuccess) onSuccess();
        return true;
      },
      {
        loadingMessage: "Saving your RSVP...",
        successMessage: "You're confirmed for this event!",
        errorMessage: "Failed to RSVP. Please try again."
      }
    );
  }, [executeAction, onSuccess]);
  
  // Handle cancel RSVP with proper feedback
  const handleCancelRSVP = useCallback(async () => {
    return executeAction(
      async () => {
        // Session check
        const sessionCheck = await PermissionService.verifySession();
        if (!sessionCheck.isValid) {
          throw new Error("Please sign in to manage your RSVP");
        }
        
        // Normally you would call your cancel RSVP service here
        console.log("Cancelling RSVP");
        
        // Simulate a successful cancellation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (onSuccess) onSuccess();
        return true;
      },
      {
        loadingMessage: "Cancelling your RSVP...",
        successMessage: "Your RSVP has been cancelled",
        errorMessage: "Failed to cancel RSVP. Please try again."
      }
    );
  }, [executeAction, onSuccess]);
  
  // Check if user can manage this event
  const canManageEvent = useCallback(async () => {
    if (!user) return false;
    
    return PermissionService.canEditEvent(
      user,
      createdBy
    );
  }, [user, createdBy]);
  
  return {
    handleRSVP,
    handleCancelRSVP,
    canManageEvent,
    isLoading
  };
}

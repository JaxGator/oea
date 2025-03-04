
import { useState, useCallback, useEffect } from "react";
import { EventFormData } from "@/components/event/EventFormTypes";
import { useAuthState } from "@/hooks/useAuthState";
import { PermissionService } from "@/services/permissions/permissionService";
import { toast } from "sonner";

/**
 * Custom hook to check if the current user has permission to edit an event
 */
export function useEventPermissions(
  eventData?: EventFormData,
  forceAdmin?: boolean,
  forceCanManage?: boolean
) {
  const { user, isAuthenticated } = useAuthState();
  const [hasValidPermission, setHasValidPermission] = useState(false);
  const [verifyingAuth, setVerifyingAuth] = useState(true);
  
  const checkPermissions = useCallback(async () => {
    setVerifyingAuth(true);

    try {
      // If no event data, then it's a new event - permission granted
      if (!eventData?.id) {
        console.log("Event Permission Check: New event, permission granted");
        setHasValidPermission(true);
        setVerifyingAuth(false);
        return true;
      }
      
      // Verify session is valid
      const sessionCheck = await PermissionService.verifySession();
      if (!sessionCheck.isValid) {
        console.log("Event Permission Check: No valid session, permission denied");
        toast.error("Your session has expired. Please sign in again.");
        setHasValidPermission(false);
        setVerifyingAuth(false);
        return false;
      }
      
      // Check permission using the PermissionService
      const hasPermission = await PermissionService.canEditEvent(
        user,
        eventData.created_by,
        forceAdmin,
        forceCanManage
      );
      
      setHasValidPermission(hasPermission);
      setVerifyingAuth(false);
      return hasPermission;
    } catch (error) {
      console.error("Error checking permissions:", error);
      toast.error("Error checking permissions. Please try again.");
      setHasValidPermission(false);
      setVerifyingAuth(false);
      return false;
    }
  }, [eventData, user, forceAdmin, forceCanManage]);
  
  // Automatically check permissions when the hook is initialized
  useEffect(() => {
    if (eventData || forceAdmin || forceCanManage) {
      checkPermissions();
    } else {
      setVerifyingAuth(false);
    }
  }, [eventData, checkPermissions, forceAdmin, forceCanManage]);
  
  return {
    hasValidPermission,
    checkPermissions,
    verifyingAuth,
    isAuthenticated
  };
}

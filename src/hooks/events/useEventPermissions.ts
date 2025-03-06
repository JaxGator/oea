
import { useState, useCallback } from "react";
import { PermissionService } from "@/services/permissions/permissionService";
import { useAuthState } from "@/hooks/useAuthState";
import { Event } from "@/types/event";

export function useEventPermissions(event?: Event, forceAdmin = false, forceCanManage = false) {
  const { user } = useAuthState();
  const [hasValidPermission, setHasValidPermission] = useState(false);
  const [verifyingAuth, setVerifyingAuth] = useState(false);

  const checkPermissions = useCallback(async () => {
    // If no event is provided, permission checking is skipped
    if (!event) {
      console.log("No event to check permissions for");
      setHasValidPermission(true);
      return;
    }

    try {
      setVerifyingAuth(true);
      console.log("Checking event permissions:", { 
        eventId: event.id, 
        eventCreator: event.created_by,
        userId: user?.id,
        forceAdmin,
        forceCanManage
      });

      // For viewing events, always grant permission
      setHasValidPermission(true);
    } catch (error) {
      console.error("Permission check failed:", error);
      setHasValidPermission(false);
    } finally {
      setVerifyingAuth(false);
    }
  }, [event, user, forceAdmin, forceCanManage]);

  return {
    hasValidPermission,
    verifyingAuth,
    checkPermissions
  };
}

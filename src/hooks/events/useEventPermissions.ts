
import { useState, useCallback, useEffect } from "react";
import { Event, EventFormData } from "@/types/event";
import { useAuthState } from "@/hooks/useAuthState";
import { PermissionService } from "@/services/permissions/permissionService";

export function useEventPermissions(event?: Event | EventFormData, forceAdmin = false, forceCanManage = false) {
  const [hasValidPermission, setHasValidPermission] = useState(false);
  const [verifyingAuth, setVerifyingAuth] = useState(true);
  const { user } = useAuthState();

  const checkPermissions = useCallback(async () => {
    if (!user) {
      setHasValidPermission(false);
      setVerifyingAuth(false);
      return;
    }

    const createdBy = (event as Event)?.created_by || '';
    
    if (!createdBy) {
      // New event — allow if user is admin/member/approved or forced
      const canCreate = forceAdmin || forceCanManage || !!user.is_admin || !!user.is_approved || !!user.is_member;
      setHasValidPermission(canCreate);
      setVerifyingAuth(false);
      return;
    }

    const canEdit = await PermissionService.canEditEvent(user, createdBy, forceAdmin, forceCanManage);
    setHasValidPermission(canEdit);
    setVerifyingAuth(false);
  }, [user, event, forceAdmin, forceCanManage]);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return {
    hasValidPermission,
    verifyingAuth,
    checkPermissions
  };
}

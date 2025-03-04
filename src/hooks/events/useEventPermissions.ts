
import { useCallback, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { PermissionService } from "@/services/permissions/permissionService";
import { usePermissions } from "@/hooks/usePermissions";

export const useEventPermissions = (eventId?: string, createdBy?: string) => {
  const { user } = useAuthState();
  const [canEditEvent, setCanEditEvent] = useState<boolean | null>(null);
  const [canDeleteEvent, setCanDeleteEvent] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getEffectivePermissions } = usePermissions();

  // Get effective permissions synchronously
  const { isAdmin, canManageEvents } = getEffectivePermissions();

  const checkPermissions = useCallback(async () => {
    setIsLoading(true);

    try {
      // Check if the user can edit this event
      if (eventId && createdBy) {
        const [canEdit, canDelete] = await Promise.all([
          PermissionService.hasPermission(user, 'edit', eventId, createdBy),
          PermissionService.hasPermission(user, 'delete', eventId, createdBy)
        ]);

        setCanEditEvent(canEdit);
        setCanDeleteEvent(canDelete);
      } else {
        setCanEditEvent(false);
        setCanDeleteEvent(false);
      }
    } catch (error) {
      console.error("Error checking event permissions:", error);
      setCanEditEvent(false);
      setCanDeleteEvent(false);
    } finally {
      setIsLoading(false);
    }
  }, [user, eventId, createdBy]);

  return {
    isLoading,
    checkPermissions,
    canEditEvent: canEditEvent ?? false,
    canDeleteEvent: canDeleteEvent ?? false,
    isAdmin,
    canManageEvents,
  };
};


import { useState, useEffect } from 'react';
import { PermissionService } from '@/services/permissions/permissionService';

export function useEventPermissions(eventId?: string, createdBy?: string, user?: any) {
  const [canEditEvent, setCanEditEvent] = useState<boolean>(false);
  const [canDeleteEvent, setCanDeleteEvent] = useState<boolean>(false);
  const [canManageEvent, setCanManageEvent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if the user can edit this event
      if (eventId && createdBy) {
        const canEdit = PermissionService.hasPermission(user, 'edit', eventId, createdBy);
        const canDelete = PermissionService.hasPermission(user, 'delete', eventId, createdBy);
        const canManage = PermissionService.hasPermission(user, 'manage', eventId, createdBy);

        setCanEditEvent(canEdit);
        setCanDeleteEvent(canDelete);
        setCanManageEvent(canManage);
      }
    } catch (err) {
      console.error('Error checking permissions:', err);
      setError(err instanceof Error ? err : new Error('Unknown error checking permissions'));
    } finally {
      setIsLoading(false);
    }
  }, [eventId, createdBy, user]);

  return {
    canEditEvent,
    canDeleteEvent,
    canManageEvent,
    isLoading,
    error
  };
}

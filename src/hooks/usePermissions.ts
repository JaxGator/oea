
import { useCallback } from "react";
import { usePermissionStore } from "@/hooks/auth/usePermissionStore";
import { PermissionService } from "@/services/permissions/permissionService";
import { toast } from "sonner";

export interface PermissionOptions {
  showFeedback?: boolean;
  customErrorMessage?: string;
}

/**
 * A unified hook for handling permission checks across the application
 * This is now a wrapper around the central permission store
 */
export function usePermissions() {
  const {
    isVerifying,
    checkPermission: storeCheckPermission,
    getEffectivePermissions,
    invalidateCache,
    isAdmin,
    isMember,
    isApproved,
    canManageEvents
  } = usePermissionStore();

  // Direct permission check with options
  const checkPermission = useCallback(async (
    type: 'edit' | 'delete' | 'manage' | 'admin', 
    entityId?: string,
    createdBy?: string,
    options?: PermissionOptions
  ): Promise<boolean> => {
    const showFeedback = options?.showFeedback || false;
    const customMessage = options?.customErrorMessage;
    
    // Use the store's check permission (modified to not expect showFeedback)
    const result = await storeCheckPermission(type, entityId, createdBy);
    
    // If custom message is provided and permission is denied, show it
    if (!result && showFeedback && customMessage) {
      toast.error(customMessage);
    } else if (!result && showFeedback) {
      // Use the service to get a default error message
      const message = PermissionService.getPermissionErrorMessage(type);
      toast.error(message);
    }
    
    return result;
  }, [storeCheckPermission]);

  // Cached permission check with optional state update
  const verifyPermission = useCallback(async (
    type: 'edit' | 'delete' | 'manage' | 'admin',
    entityId?: string,
    createdBy?: string,
    options?: PermissionOptions
  ): Promise<boolean> => {
    return checkPermission(type, entityId, createdBy, options);
  }, [checkPermission]);
  
  // Helper to show a permission denied message
  const showPermissionDeniedToast = useCallback((
    type: 'edit' | 'delete' | 'manage' | 'admin',
    customMessage?: string
  ) => {
    const message = customMessage || PermissionService.getPermissionErrorMessage(type);
    toast.error(message);
  }, []);
  
  return {
    isVerifying,
    verifyPermission,
    checkPermission,
    getEffectivePermissions,
    showPermissionDeniedToast,
    // Expose these for backward compatibility
    isAdmin,
    isMember, 
    isApproved,
    canManageEvents
  };
}


import { useEffect, useState, useCallback } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import { PermissionService } from "@/services/permissions/permissionService";
import { toast } from "sonner";

export interface PermissionOptions {
  showFeedback?: boolean;
  customErrorMessage?: string;
}

/**
 * A unified hook for handling permission checks across the application
 */
export function usePermissions() {
  const { user, isAuthenticated } = useAuthState();
  const [isVerifying, setIsVerifying] = useState(false);
  const [permissionCache, setPermissionCache] = useState<Record<string, boolean>>({});

  // Direct permission check that does not update state
  const checkPermission = useCallback(async (
    type: 'edit' | 'delete' | 'manage' | 'admin', 
    entityId?: string,
    createdBy?: string,
    options?: PermissionOptions
  ): Promise<boolean> => {
    const showFeedback = options?.showFeedback || false;
    
    // Always check session validity first
    const { data } = await supabase.auth.getSession();
    const isSessionValid = !!data.session;
    
    if (!isSessionValid || !user?.id) {
      if (showFeedback) {
        toast.error("You must be logged in to perform this action");
      }
      return false;
    }
    
    // Immediate checks for admin and member status
    const isAdmin = user.is_admin === true;
    const isMember = user.is_member === true;
    const isApproved = user.is_approved === true;
    
    // Admin/member/approved users always have all permissions
    if (isAdmin || isMember || isApproved) {
      return true;
    }
    
    // Type-specific checks
    switch (type) {
      case 'admin':
        if (showFeedback && !isAdmin) {
          toast.error(options?.customErrorMessage || "This action requires administrator privileges");
        }
        return isAdmin;
        
      case 'manage':
        if (showFeedback && !(isAdmin || isMember || isApproved)) {
          toast.error(options?.customErrorMessage || "This action requires approved member privileges");
        }
        return isAdmin || isMember || isApproved;
        
      case 'edit':
      case 'delete':
        if (!entityId || !createdBy) {
          if (showFeedback) {
            toast.error(options?.customErrorMessage || "Unable to verify permissions for this action");
          }
          return false;
        }
        
        // Creator can always edit/delete their own content
        const hasPermission = createdBy === user.id;
        if (showFeedback && !hasPermission) {
          toast.error(options?.customErrorMessage || 
            `You don't have permission to ${type} this item`);
        }
        return hasPermission;
        
      default:
        if (showFeedback) {
          toast.error(options?.customErrorMessage || "Invalid permission check");
        }
        return false;
    }
  }, [user]);

  // Cached permission check with optional state update
  const verifyPermission = useCallback(async (
    type: 'edit' | 'delete' | 'manage' | 'admin',
    entityId?: string,
    createdBy?: string,
    options?: PermissionOptions
  ): Promise<boolean> => {
    // Generate cache key
    const cacheKey = `${type}:${entityId || ''}:${createdBy || ''}`;
    
    // Return cached result if available
    if (cacheKey in permissionCache) {
      return permissionCache[cacheKey];
    }
    
    setIsVerifying(true);
    
    try {
      const hasPermission = await checkPermission(type, entityId, createdBy, options);
      
      // Cache the result
      setPermissionCache(prev => ({
        ...prev,
        [cacheKey]: hasPermission
      }));
      
      return hasPermission;
    } catch (error) {
      console.error('Permission verification error:', error);
      
      // Show error feedback if requested
      if (options?.showFeedback) {
        toast.error(options?.customErrorMessage || "An error occurred while checking permissions");
      }
      
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [checkPermission, permissionCache]);
  
  // Helper function to get effective permission values synchronously
  const getEffectivePermissions = useCallback(() => {
    if (!user) {
      return {
        isAdmin: false,
        canManageEvents: false,
        isAuthenticated: false
      };
    }
    
    const isAdmin = user.is_admin === true;
    const isMember = user.is_member === true;
    const isApproved = user.is_approved === true;
    
    return {
      isAdmin,
      canManageEvents: isAdmin || isMember || isApproved,
      isAuthenticated
    };
  }, [user, isAuthenticated]);
  
  // Clear cache when user changes
  useEffect(() => {
    setPermissionCache({});
  }, [user?.id]);
  
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
    isAdmin: user?.is_admin === true,
    isMember: user?.is_member === true, 
    isApproved: user?.is_approved === true,
    canManageEvents: user?.is_admin === true || user?.is_member === true || user?.is_approved === true
  };
}

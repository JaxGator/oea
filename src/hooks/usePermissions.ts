
import { useEffect, useState, useCallback } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import { PermissionService } from "@/services/permissions/permissionService";
import { toast } from "sonner";

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
    createdBy?: string
  ): Promise<boolean> => {
    // Always check session validity first
    const { data } = await supabase.auth.getSession();
    const isSessionValid = !!data.session;
    
    if (!isSessionValid || !user?.id) {
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
        return isAdmin;
        
      case 'manage':
        return isAdmin || isMember || isApproved;
        
      case 'edit':
      case 'delete':
        if (!entityId || !createdBy) {
          return false;
        }
        
        // Creator can always edit/delete their own content
        return createdBy === user.id;
        
      default:
        return false;
    }
  }, [user]);

  // Cached permission check with optional state update
  const verifyPermission = useCallback(async (
    type: 'edit' | 'delete' | 'manage' | 'admin',
    entityId?: string,
    createdBy?: string
  ): Promise<boolean> => {
    // Generate cache key
    const cacheKey = `${type}:${entityId || ''}:${createdBy || ''}`;
    
    // Return cached result if available
    if (cacheKey in permissionCache) {
      return permissionCache[cacheKey];
    }
    
    setIsVerifying(true);
    
    try {
      const hasPermission = await checkPermission(type, entityId, createdBy);
      
      // Cache the result
      setPermissionCache(prev => ({
        ...prev,
        [cacheKey]: hasPermission
      }));
      
      return hasPermission;
    } catch (error) {
      console.error('Permission verification error:', error);
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
  
  return {
    isVerifying,
    verifyPermission,
    checkPermission,
    getEffectivePermissions,
    // Expose these for backward compatibility
    isAdmin: user?.is_admin === true,
    isMember: user?.is_member === true, 
    isApproved: user?.is_approved === true,
    canManageEvents: user?.is_admin === true || user?.is_member === true || user?.is_approved === true
  };
}


import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PermissionState {
  isAdmin: boolean;
  canManageEvents: boolean;
  isMember: boolean;
  isApproved: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  permissionCache: Record<string, boolean>;
}

interface PermissionContextValue extends PermissionState {
  isVerifying: boolean;
  checkPermission: (type: PermissionType, entityId?: string, createdBy?: string, showFeedback?: boolean) => Promise<boolean>;
  invalidateCache: () => void;
  getEffectivePermissions: () => PermissionState;
}

type PermissionType = 'edit' | 'delete' | 'manage' | 'admin';

const initialState: PermissionState = {
  isAdmin: false,
  canManageEvents: false,
  isMember: false,
  isApproved: false,
  isAuthenticated: false,
  userId: null,
  permissionCache: {}
};

const PermissionContext = createContext<PermissionContextValue>({
  ...initialState,
  isVerifying: false,
  checkPermission: async () => false,
  invalidateCache: () => {},
  getEffectivePermissions: () => initialState,
});

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuthState();
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [permissionCache, setPermissionCache] = useState<Record<string, boolean>>({});
  
  // Calculate effective permissions based on user roles
  const permissionState = useMemo<PermissionState>(() => {
    if (!user) {
      return initialState;
    }
    
    const isAdmin = user.is_admin === true;
    const isMember = user.is_member === true;
    const isApproved = user.is_approved === true;
    
    return {
      isAdmin,
      isMember,
      isApproved,
      canManageEvents: isAdmin || isMember || isApproved,
      isAuthenticated,
      userId: user.id,
      permissionCache
    };
  }, [user, isAuthenticated, permissionCache]);
  
  // Clear cache when user changes
  useEffect(() => {
    setPermissionCache({});
  }, [user?.id]);
  
  // Check permission with caching
  const checkPermission = useCallback(async (
    type: PermissionType,
    entityId?: string,
    createdBy?: string,
    showFeedback: boolean = false
  ): Promise<boolean> => {
    // Early return for admins and managers
    if (permissionState.isAdmin) {
      return true;
    }
    
    if ((type === 'manage' || type === 'edit' || type === 'delete') && 
        (permissionState.isMember || permissionState.isApproved)) {
      return true;
    }
    
    // Generate cache key
    const cacheKey = `${type}:${entityId || ''}:${createdBy || ''}`;
    
    // Return cached result if available
    if (cacheKey in permissionCache) {
      return permissionCache[cacheKey];
    }
    
    setIsVerifying(true);
    
    try {
      // Always check session validity first
      const { data } = await supabase.auth.getSession();
      const isSessionValid = !!data.session;
      
      if (!isSessionValid || !user?.id) {
        if (showFeedback) {
          toast.error("You must be logged in to perform this action");
        }
        return false;
      }
      
      let hasPermission = false;
      
      // Type-specific checks
      switch (type) {
        case 'admin':
          hasPermission = permissionState.isAdmin;
          if (showFeedback && !hasPermission) {
            toast.error("This action requires administrator privileges");
          }
          break;
          
        case 'manage':
          hasPermission = permissionState.canManageEvents;
          if (showFeedback && !hasPermission) {
            toast.error("This action requires approved member privileges");
          }
          break;
          
        case 'edit':
        case 'delete':
          if (!entityId || !createdBy) {
            if (showFeedback) {
              toast.error("Unable to verify permissions for this action");
            }
            return false;
          }
          
          // Creator can always edit/delete their own content
          hasPermission = createdBy === user.id;
          if (showFeedback && !hasPermission) {
            toast.error(`You don't have permission to ${type} this item`);
          }
          break;
          
        default:
          if (showFeedback) {
            toast.error("Invalid permission check");
          }
          return false;
      }
      
      // Cache the result
      setPermissionCache(prev => ({
        ...prev,
        [cacheKey]: hasPermission
      }));
      
      return hasPermission;
    } finally {
      setIsVerifying(false);
    }
  }, [permissionState, permissionCache, user]);
  
  // Force invalidate the cache
  const invalidateCache = useCallback(() => {
    setPermissionCache({});
  }, []);
  
  // Get current permissions synchronously
  const getEffectivePermissions = useCallback(() => {
    return permissionState;
  }, [permissionState]);
  
  const contextValue = useMemo<PermissionContextValue>(() => ({
    ...permissionState,
    isVerifying,
    checkPermission,
    invalidateCache,
    getEffectivePermissions,
  }), [permissionState, isVerifying, checkPermission, invalidateCache, getEffectivePermissions]);
  
  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissionStore = () => useContext(PermissionContext);

// Export a compatibility hook that matches the previous interface
export const usePermissionCache = () => {
  const {
    isVerifying,
    checkPermission,
    getEffectivePermissions,
    invalidateCache,
    isAdmin,
    isMember,
    isApproved,
    canManageEvents
  } = usePermissionStore();
  
  return {
    isVerifying,
    checkPermission,
    getEffectivePermissions,
    clearCache: invalidateCache,
    isAdmin,
    isMember,
    isApproved,
    canManageEvents
  };
};

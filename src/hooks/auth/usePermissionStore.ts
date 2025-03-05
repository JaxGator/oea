
import { useContext } from 'react';
import { PermissionContext } from './permissionContext';

// Main hook to access the permission store
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


import { useContext } from 'react';
import { PermissionContext } from './permissionContext';

// Main hook to access the permission store
export const usePermissionStore = () => {
  const context = useContext(PermissionContext);
  
  if (context === undefined) {
    console.error('usePermissionStore must be used within a PermissionProvider');
    return {
      isVerifying: true,
      checkPermission: () => false,
      getEffectivePermissions: () => ({
        canEdit: false,
        canDelete: false,
        canManage: false,
        isAdmin: false,
        canManageEvents: false,
        userId: undefined
      }),
      invalidateCache: () => {},
      isAdmin: false,
      isMember: false,
      isApproved: false,
      canManageEvents: false
    };
  }
  
  return context;
};

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

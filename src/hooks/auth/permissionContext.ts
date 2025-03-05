
import { createContext } from 'react';

export interface PermissionContextType {
  isVerifying: boolean;
  checkPermission: (type: 'edit' | 'delete' | 'manage' | 'admin', entityId?: string, createdBy?: string) => boolean;
  getEffectivePermissions: (entityId?: string, createdBy?: string) => {
    canEdit: boolean;
    canDelete: boolean;
    canManage: boolean;
    isAdmin: boolean;
    canManageEvents: boolean;
    userId?: string;
  };
  invalidateCache: () => void;
  isAdmin: boolean;
  isMember: boolean;
  isApproved: boolean;
  canManageEvents: boolean;
}

// Create the context with a default value
export const PermissionContext = createContext<PermissionContextType>({
  isVerifying: true,
  checkPermission: () => false,
  getEffectivePermissions: () => ({
    canEdit: false,
    canDelete: false,
    canManage: false,
    isAdmin: false,
    canManageEvents: false
  }),
  invalidateCache: () => {},
  isAdmin: false,
  isMember: false,
  isApproved: false,
  canManageEvents: false
});

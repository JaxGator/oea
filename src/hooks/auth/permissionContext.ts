
import { createContext } from 'react';

interface PermissionState {
  isAdmin: boolean;
  canManageEvents: boolean;
  isMember: boolean;
  isApproved: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  permissionCache: Record<string, boolean>;
}

export type PermissionType = 'edit' | 'delete' | 'manage' | 'admin';

export interface PermissionContextValue extends PermissionState {
  isVerifying: boolean;
  checkPermission: (type: PermissionType, entityId?: string, createdBy?: string, showFeedback?: boolean) => Promise<boolean>;
  invalidateCache: () => void;
  getEffectivePermissions: () => PermissionState;
}

export const initialPermissionState: PermissionState = {
  isAdmin: false,
  canManageEvents: false,
  isMember: false,
  isApproved: false,
  isAuthenticated: false,
  userId: null,
  permissionCache: {}
};

export const PermissionContext = createContext<PermissionContextValue>({
  ...initialPermissionState,
  isVerifying: false,
  checkPermission: async () => false,
  invalidateCache: () => {},
  getEffectivePermissions: () => initialPermissionState,
});

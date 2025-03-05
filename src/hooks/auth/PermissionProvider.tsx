
import React, { useEffect, useMemo, useState } from "react";
import { PermissionContext } from "./permissionContext";
import { useAuthState } from "@/hooks/useAuthState";
import { PermissionService } from "@/services/permissions/permissionService";

interface PermissionProviderProps {
  children: React.ReactNode;
}

export function PermissionProvider({ children }: PermissionProviderProps) {
  const { profile, isLoading } = useAuthState();
  const [cacheBuster, setCacheBuster] = useState(0);

  const isAdmin = !!profile?.is_admin;
  const isMember = !!profile?.is_member;
  const isApproved = !!profile?.is_approved;
  const canManageEvents = isAdmin || (isMember && isApproved);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => {
    const checkPermission = (
      type: 'edit' | 'delete' | 'manage' | 'admin',
      entityId?: string,
      createdBy?: string
    ): boolean => {
      return PermissionService.hasPermission(profile, type, entityId, createdBy);
    };

    const getEffectivePermissions = (
      entityId?: string,
      createdBy?: string
    ) => {
      return {
        canEdit: checkPermission('edit', entityId, createdBy),
        canDelete: checkPermission('delete', entityId, createdBy),
        canManage: checkPermission('manage', entityId, createdBy),
        isAdmin: checkPermission('admin', entityId, createdBy),
        canManageEvents: isAdmin || (isMember && isApproved),
        userId: profile?.id
      };
    };

    const invalidateCache = () => {
      setCacheBuster(prev => prev + 1);
    };

    return {
      isVerifying: isLoading,
      checkPermission,
      getEffectivePermissions,
      invalidateCache,
      isAdmin,
      isMember,
      isApproved,
      canManageEvents
    };
  }, [profile, isLoading, isAdmin, isMember, isApproved, canManageEvents, cacheBuster]);

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
}


import React, { useEffect, useMemo, useState } from "react";
import { PermissionContext } from "./permissionContext";
import { useAuthState } from "@/hooks/useAuthState";
import { PermissionService } from "@/services/permissions/permissionService";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

interface PermissionProviderProps {
  children: React.ReactNode;
}

export function PermissionProvider({ children }: PermissionProviderProps) {
  const { profile, isLoading } = useAuthState();
  const [cacheBuster, setCacheBuster] = useState(0);

  // Log auth state to debug
  useEffect(() => {
    console.log("PermissionProvider: Auth state:", {
      hasProfile: !!profile,
      profileId: profile?.id,
      isAdmin: profile?.is_admin,
      isApproved: profile?.is_approved,
      isLoading
    });
  }, [profile, isLoading]);

  const isAdmin = !!profile?.is_admin;
  const isMember = !!profile?.is_member;
  const isApproved = !!profile?.is_approved;
  const canManageEvents = isAdmin || (isMember && isApproved);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => {
    try {
      const checkPermission = (
        type: 'edit' | 'delete' | 'manage' | 'admin',
        entityId?: string,
        createdBy?: string
      ): boolean => {
        try {
          return PermissionService.hasPermission(profile, type, entityId, createdBy);
        } catch (error) {
          console.error("Permission check error:", error);
          return false; // Fail safe by denying permission on error
        }
      };

      const getEffectivePermissions = (
        entityId?: string,
        createdBy?: string
      ) => {
        try {
          return {
            canEdit: checkPermission('edit', entityId, createdBy),
            canDelete: checkPermission('delete', entityId, createdBy),
            canManage: checkPermission('manage', entityId, createdBy),
            isAdmin: checkPermission('admin', entityId, createdBy),
            canManageEvents: isAdmin || (isMember && isApproved),
            userId: profile?.id
          };
        } catch (error) {
          console.error("Getting effective permissions error:", error);
          // Return fail-safe permissions (no permissions) on error
          return {
            canEdit: false,
            canDelete: false,
            canManage: false,
            isAdmin: false,
            canManageEvents: false,
            userId: profile?.id
          };
        }
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
    } catch (error) {
      console.error("Error creating permission context:", error);
      // Return fallback context with no permissions
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
  }, [profile, isLoading, isAdmin, isMember, isApproved, canManageEvents, cacheBuster]);

  return (
    <ErrorBoundary 
      fallback={
        <div className="p-4 rounded-lg bg-yellow-50 text-yellow-800">
          <h3 className="font-medium">Permission System Error</h3>
          <p>The permission system encountered an error. Some features may be limited.</p>
        </div>
      }
    >
      <PermissionContext.Provider value={contextValue}>
        {children}
      </PermissionContext.Provider>
    </ErrorBoundary>
  );
}

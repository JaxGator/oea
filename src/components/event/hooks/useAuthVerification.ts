
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { canEditEvent } from "@/utils/permissionsUtils";
import type { Event } from "@/types/event";

export function useAuthVerification(
  initialData: Event, 
  forceAdmin = false, 
  forceCanManage = false
) {
  const [verifyingAuth, setVerifyingAuth] = useState(true);
  const [checkedSessionData, setCheckedSessionData] = useState(false);
  const [hasValidPermission, setHasValidPermission] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuthState();
  // Add a flag to prevent showing multiple toast messages
  const [hasShownToast, setHasShownToast] = useState(false);

  const checkAuthAndPermissions = useCallback(async () => {
    try {
      console.log("Starting auth verification check for event:", initialData?.id);
      setVerifyingAuth(true);
      
      // If force admin or force can manage is true, grant permission immediately
      if (forceAdmin || forceCanManage) {
        console.log("Override detected: Admin or management status forced to true. Granting permission.");
        setHasValidPermission(true);
        setVerifyingAuth(false);
        return true;
      }
      
      // IMPORTANT: Grant permission to admin and members automatically without further checks
      if (user) {
        const isAdmin = !!user.is_admin;
        const isMember = !!user.is_member;
        const isApproved = !!user.is_approved;
        
        // All admins, members, and approved users can manage events
        const canManageEvents = isAdmin || isMember || isApproved;
        
        console.log("Auth verification - User status:", { 
          userId: user.id, 
          isAdmin,
          isMember,
          isApproved,
          canManageEvents,
          eventCreator: initialData?.created_by || 'unknown'
        });
        
        // If user is admin or can manage events, grant permission immediately
        // CRITICAL FIX: This is the most important condition
        if (isAdmin || canManageEvents) {
          console.log("Admin or member detected, granting permission IMMEDIATELY");
          setHasValidPermission(true);
          setVerifyingAuth(false);
          return true;
        }
      }
      
      // Otherwise perform a direct session check
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        // Only show toast once
        setHasValidPermission(false);
        setVerifyingAuth(false);
        return false;
      }
      
      const sessionExists = !!data.session;
      
      console.log("Auth verification - Direct auth check:", { 
        sessionExists,
        userId: data.session?.user?.id,
        timestamp: new Date().toISOString()
      });
      
      setCheckedSessionData(true);
      
      if (!sessionExists) {
        console.error("Authentication error: No active session");
        // Don't show toast messages here, let the component handle it
        setHasValidPermission(false);
        setVerifyingAuth(false);
        return false;
      }

      // No need to check permissions if we don't have initial data (creating new event)
      if (!initialData?.id) {
        setHasValidPermission(true);
        setVerifyingAuth(false);
        return true;
      }

      // If we reach here, we need to do a full permission check
      if (data.session?.user?.id) {
        // Recheck admin and approval status directly from the profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('is_admin, is_approved, is_member')
          .eq('id', data.session.user.id)
          .single();
        
        const isAdmin = profileData?.is_admin || false;
        const isApproved = profileData?.is_approved || false;
        const isMember = profileData?.is_member || false;
        
        // CRITICAL FIX: Any admin or member has permission - this is the real fix
        const canManageEvents = isAdmin || isApproved || isMember;
        
        console.log("Profile data re-fetched:", {
          profileData,
          isAdmin,
          isApproved,
          isMember,
          canManageEvents
        });
        
        // IMMEDIATELY grant access for admins and members - this is where it was failing
        if (isAdmin || canManageEvents) {
          console.log("Admin or member detected from profile data, granting permission IMMEDIATELY");
          setHasValidPermission(true);
          setVerifyingAuth(false);
          return true;
        }
        
        // Only for non-admins/members, check if they're the creator
        const hasEditPermission = canEditEvent(
          data.session.user.id, 
          isAdmin, 
          canManageEvents, 
          initialData.created_by || ''
        );
        
        console.log("Final permission check:", { 
          userId: data.session.user.id,
          eventCreator: initialData.created_by,
          isAdmin,
          isApproved,
          isMember,
          canManageEvents,
          hasPermission: hasEditPermission
        });

        setHasValidPermission(hasEditPermission);
        
        if (!hasEditPermission) {
          console.error("Permission denied: user cannot edit this event");
          // Don't show toast messages here, let the component handle it
        }
        
        setVerifyingAuth(false);
        return hasEditPermission;
      }
      
      setHasValidPermission(false);
      setVerifyingAuth(false);
      return false;
    } catch (err) {
      console.error("Authentication check failed:", err);
      // Don't show toast messages here, let the component handle it
      setHasValidPermission(false);
      setVerifyingAuth(false);
      return false;
    }
  }, [initialData, user, forceAdmin, forceCanManage, hasShownToast]);

  // Run checks when component mounts or when user/initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("Running auth check due to initialData or user change");
      checkAuthAndPermissions();
    }
  }, [checkAuthAndPermissions, initialData, user?.id, forceAdmin, forceCanManage]);

  return {
    verifyingAuth,
    checkedSessionData,
    hasValidPermission,
    checkAuthAndPermissions,
    setHasShownToast,
    hasShownToast
  };
}

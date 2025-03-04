
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { canEditEvent } from "@/utils/permissionsUtils";
import type { Event } from "@/types/event";

export function useEventPermissions(
  eventData: Event | null | undefined, 
  forceAdmin = false, 
  forceCanManage = false
) {
  const [verifyingAuth, setVerifyingAuth] = useState(true);
  const [hasValidPermission, setHasValidPermission] = useState(false);
  const { user, isAuthenticated } = useAuthState();
  const [hasShownToast, setHasShownToast] = useState(false);

  const checkPermissions = useCallback(async () => {
    try {
      console.log("Starting permission check for event:", eventData?.id);
      setVerifyingAuth(true);
      
      // If force admin or force can manage is true, grant permission immediately
      if (forceAdmin || forceCanManage) {
        console.log("Permission override: Admin or management status forced to true");
        setHasValidPermission(true);
        setVerifyingAuth(false);
        return true;
      }
      
      // Grant permission to admin, members, and approved users automatically
      if (user) {
        const isAdmin = !!user.is_admin;
        const isMember = !!user.is_member;
        const isApproved = !!user.is_approved;
        const canManageEvents = isAdmin || isMember || isApproved;
        
        console.log("Permission check - User status:", { 
          userId: user.id, 
          isAdmin, isMember, isApproved, canManageEvents,
          eventCreator: eventData?.created_by || 'unknown'
        });
        
        // CRITICAL FIX: Admins and members always have permission
        if (isAdmin || canManageEvents) {
          console.log("Admin or member detected, granting permission immediately");
          setHasValidPermission(true);
          setVerifyingAuth(false);
          return true;
        }
      }
      
      // Direct session check if user state isn't conclusive
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        console.error("Session check failed:", error || "No active session");
        setHasValidPermission(false);
        setVerifyingAuth(false);
        return false;
      }
      
      // No need to check permissions for new events
      if (!eventData?.id) {
        setHasValidPermission(true);
        setVerifyingAuth(false);
        return true;
      }

      // For existing events, check if user is creator or has special permissions
      if (data.session?.user?.id) {
        // Recheck admin status directly from profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('is_admin, is_approved, is_member')
          .eq('id', data.session.user.id)
          .single();
        
        const isAdmin = profileData?.is_admin || false;
        const isApproved = profileData?.is_approved || false;
        const isMember = profileData?.is_member || false;
        const canManageEvents = isAdmin || isApproved || isMember;
        
        // CRITICAL: Admin or members always have permission
        if (isAdmin || canManageEvents) {
          console.log("Admin or member detected from profile data, granting permission");
          setHasValidPermission(true);
          setVerifyingAuth(false);
          return true;
        }
        
        // For regular users, check if they're the creator
        const hasPermission = canEditEvent(
          data.session.user.id, 
          isAdmin, 
          canManageEvents, 
          eventData.created_by || ''
        );
        
        setHasValidPermission(hasPermission);
        setVerifyingAuth(false);
        return hasPermission;
      }
      
      setHasValidPermission(false);
      setVerifyingAuth(false);
      return false;
    } catch (err) {
      console.error("Permission check failed:", err);
      setHasValidPermission(false);
      setVerifyingAuth(false);
      return false;
    }
  }, [eventData, user, forceAdmin, forceCanManage]);

  // Run check when component mounts or dependencies change
  useEffect(() => {
    if (eventData) {
      checkPermissions();
    }
  }, [checkPermissions, eventData, user?.id, forceAdmin, forceCanManage]);

  return {
    verifyingAuth,
    hasValidPermission,
    checkPermissions,
    isAuthenticated,
    setHasShownToast,
    hasShownToast
  };
}

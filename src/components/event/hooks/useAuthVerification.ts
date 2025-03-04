
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
      
      // Grant permission to admin and members automatically
      if (user) {
        const isAdmin = !!user.is_admin;
        const isMember = !!user.is_member;
        const isApproved = !!user.is_approved;
        
        // All admins, members, and approved users can manage events
        const canManageEvents = isAdmin || isMember || isApproved;
        
        console.log("Auth from useAuthState:", { 
          userId: user.id, 
          isAdmin,
          isMember,
          isApproved,
          canManageEvents,
          eventCreator: initialData?.created_by || 'unknown'
        });
        
        // If user is admin or can manage events, grant permission immediately
        if (isAdmin || canManageEvents) {
          console.log("Admin or member detected, granting permission");
          setHasValidPermission(true);
          setVerifyingAuth(false);
          return true;
        }
      }
      
      // Otherwise perform a direct session check
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        toast.error("Authentication error. Please try logging in again.");
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
        toast.error("You must be logged in to edit events");
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
        
        // Any admin or member has permission
        const canManageEvents = isAdmin || isApproved || isMember;
        
        console.log("Profile data re-fetched:", {
          profileData,
          isAdmin,
          isApproved,
          isMember,
          canManageEvents
        });
        
        // Skip complex permission check for admins and members - grant immediate access
        if (isAdmin || canManageEvents) {
          console.log("Admin or member detected from profile data, granting permission");
          setHasValidPermission(true);
          setVerifyingAuth(false);
          return true;
        }
        
        // For non-admins/members, check if they're the creator
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
          toast.error("You don't have permission to edit this event");
        }
        
        setVerifyingAuth(false);
        return hasEditPermission;
      }
      
      setHasValidPermission(false);
      setVerifyingAuth(false);
      return false;
    } catch (err) {
      console.error("Authentication check failed:", err);
      toast.error("Authentication error. Please try logging in again.");
      setHasValidPermission(false);
      setVerifyingAuth(false);
      return false;
    }
  }, [initialData, user, forceAdmin, forceCanManage]);

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
    checkAuthAndPermissions
  };
}

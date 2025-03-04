
import { useState, useCallback, useEffect } from "react";
import { EventFormData } from "@/components/event/EventFormTypes";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";

/**
 * Custom hook to check if the current user has permission to edit an event
 */
export function useEventPermissions(
  eventData?: EventFormData,
  forceAdmin?: boolean,
  forceCanManage?: boolean
) {
  const { user, isAuthenticated } = useAuthState();
  const [hasValidPermission, setHasValidPermission] = useState(false);
  const [verifyingAuth, setVerifyingAuth] = useState(true);
  
  const checkPermissions = useCallback(async () => {
    setVerifyingAuth(true);

    // If no event data, then it's a new event - permission granted
    if (!eventData?.id) {
      console.log("Event Permission Check: New event, permission granted");
      setHasValidPermission(true);
      setVerifyingAuth(false);
      return true;
    }
    
    // Get the current user session
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = user?.id || sessionData.session?.user?.id;
    
    // If no user is logged in, no permission
    if (!currentUserId) {
      console.log("Event Permission Check: No user logged in, permission denied");
      setHasValidPermission(false);
      setVerifyingAuth(false);
      return false;
    }
    
    // Check if user is creator of the event
    const isCreator = eventData.created_by === currentUserId;
    
    // Check admin and member status
    const isAdmin = forceAdmin || !!user?.is_admin;
    const isMember = !!user?.is_member;
    const isApproved = !!user?.is_approved;
    
    // Admins, members, and approved users always have permission
    if (isAdmin || isMember || isApproved || forceCanManage) {
      console.log("Event Permission Check: User is admin/member/approved, permission granted", {
        isAdmin,
        isMember,
        isApproved,
        forceCanManage
      });
      setHasValidPermission(true);
      setVerifyingAuth(false);
      return true;
    }
    
    // Regular users can only edit their own events
    if (isCreator) {
      console.log("Event Permission Check: User is event creator, permission granted");
      setHasValidPermission(true);
      setVerifyingAuth(false);
      return true;
    }
    
    console.log("Event Permission Check: Permission denied", {
      currentUserId,
      eventCreatorId: eventData.created_by,
      isAdmin,
      isMember,
      isApproved
    });
    
    setHasValidPermission(false);
    setVerifyingAuth(false);
    return false;
  }, [eventData, user, forceAdmin, forceCanManage]);
  
  // Automatically check permissions when the hook is initialized
  useEffect(() => {
    if (eventData || forceAdmin || forceCanManage) {
      checkPermissions();
    } else {
      setVerifyingAuth(false);
    }
  }, [eventData, checkPermissions, forceAdmin, forceCanManage]);
  
  return {
    hasValidPermission,
    checkPermissions,
    verifyingAuth,
    isAuthenticated
  };
}


import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuthState } from "@/hooks/useAuthState";
import { canEditEvent } from "@/utils/permissionsUtils";
import type { Event } from "@/types/event";

export function useAuthVerification(initialData: Event) {
  const [verifyingAuth, setVerifyingAuth] = useState(true);
  const [checkedSessionData, setCheckedSessionData] = useState(false);
  const [hasValidPermission, setHasValidPermission] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuthState();

  const checkAuthAndPermissions = useCallback(async () => {
    try {
      setVerifyingAuth(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        toast.error("Authentication error. Please try logging in again.");
        setHasValidPermission(false);
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
        return false;
      }

      // No need to check permissions if we don't have initial data (creating new event)
      if (!initialData?.id) {
        setHasValidPermission(true);
        setVerifyingAuth(false);
        return true;
      }

      // Check permissions for this specific event
      if (user && user.id) {
        const isAdmin = user.is_admin || false;
        const canManageEvents = isAdmin || user.is_approved;
        const hasEditPermission = canEditEvent(user.id, isAdmin, canManageEvents, initialData.created_by || '');
        
        console.log("Permission check:", { 
          userId: user.id,
          eventCreator: initialData.created_by,
          isAdmin,
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
  }, [initialData?.id, initialData?.created_by, user]);

  // Run checks when component mounts
  useEffect(() => {
    if (initialData) {
      checkAuthAndPermissions();
    }
  }, [checkAuthAndPermissions, initialData]);

  return {
    verifyingAuth,
    checkedSessionData,
    hasValidPermission,
    checkAuthAndPermissions
  };
}

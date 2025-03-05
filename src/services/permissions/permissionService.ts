
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/auth";

/**
 * Centralized service for managing permissions across the application
 */
export class PermissionService {
  /**
   * Checks if a user has permission to edit an event
   * @param currentUser The current user profile
   * @param createdBy The ID of the user who created the event
   * @param forceAdmin Override to grant admin privileges
   * @param forceCanManage Override to grant management privileges
   * @returns Whether the user has permission to edit the event
   */
  static async canEditEvent(
    currentUser: Profile | null,
    createdBy: string,
    forceAdmin = false,
    forceCanManage = false
  ): Promise<boolean> {
    // If no user is logged in, deny permission
    if (!currentUser?.id) {
      console.log("Permission denied: No user logged in");
      return false;
    }

    // Check if user is admin or has management capabilities
    const effectiveIsAdmin = forceAdmin || !!currentUser.is_admin;
    const effectiveCanManage = effectiveIsAdmin || 
                              forceCanManage || 
                              !!currentUser.is_approved || 
                              !!currentUser.is_member;

    // Log permission check details
    console.log("Permission check for edit:", {
      userId: currentUser.id,
      effectiveIsAdmin,
      effectiveCanManage,
      eventCreator: createdBy,
      timestamp: new Date().toISOString()
    });

    // Always grant access to admins and managers
    if (effectiveCanManage) {
      return true;
    }

    // Check if user is the creator of the event
    return currentUser.id === createdBy;
  }

  /**
   * Checks if a user has permission to delete an event
   * @param currentUser The current user profile
   * @param createdBy The ID of the user who created the event
   * @param forceAdmin Override to grant admin privileges
   * @param forceCanManage Override to grant management privileges
   * @returns Whether the user has permission to delete the event
   */
  static async canDeleteEvent(
    currentUser: Profile | null,
    createdBy: string,
    forceAdmin = false,
    forceCanManage = false
  ): Promise<boolean> {
    // Use the same logic as edit permissions for now
    return this.canEditEvent(currentUser, createdBy, forceAdmin, forceCanManage);
  }

  /**
   * Checks if a user has RSVP management capabilities
   * @param currentUser The current user profile
   * @param createdBy The ID of the user who created the event
   * @param userRSVPStatus The current RSVP status of the user
   * @returns Whether the user can manage RSVPs
   */
  static canManageRSVPs(
    currentUser: Profile | null,
    createdBy: string,
    userRSVPStatus: string | null
  ): boolean {
    // Admin/approved users can always manage RSVPs
    if (currentUser?.is_admin || currentUser?.is_approved || currentUser?.is_member) {
      return true;
    }
    
    // Event creator can manage RSVPs
    if (currentUser?.id === createdBy) {
      return true;
    }
    
    // Users who are attending can manage their own RSVPs
    return userRSVPStatus === 'attending';
  }

  /**
   * Verifies if the current session is valid and refreshes auth state
   * @returns Whether the session is valid
   */
  static async verifySession(): Promise<{isValid: boolean, userId?: string}> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session verification error:", error);
        return { isValid: false };
      }
      
      return { 
        isValid: !!data.session, 
        userId: data.session?.user?.id 
      };
    } catch (err) {
      console.error("Error verifying session:", err);
      return { isValid: false };
    }
  }
}

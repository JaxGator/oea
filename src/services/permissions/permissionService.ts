
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/auth";
import { toast } from "sonner";

/**
 * Centralized service for managing permissions across the application
 */
export class PermissionService {
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
  
  /**
   * Determines if a user has permission to perform an action based on their role
   * @param user Current user profile
   * @param type Type of permission to check
   * @param entityId ID of the entity being accessed
   * @param createdBy ID of the user who created the entity
   * @param showFeedback Whether to show toast feedback for permission issues
   * @returns Whether the user has permission
   */
  static async hasPermission(
    user: Profile | null,
    type: 'edit' | 'delete' | 'manage' | 'admin',
    entityId?: string,
    createdBy?: string,
    showFeedback: boolean = false
  ): Promise<boolean> {
    if (!user?.id) {
      if (showFeedback) {
        toast.error("You must be logged in to perform this action");
      }
      return false;
    }
    
    // Admin/member/approved users always have all permissions
    if (user.is_admin || user.is_member || user.is_approved) {
      return true;
    }
    
    // Type-specific checks
    switch (type) {
      case 'admin':
        if (showFeedback && !user.is_admin) {
          toast.error("This action requires administrator privileges");
        }
        return !!user.is_admin;
        
      case 'manage':
        if (showFeedback && !(user.is_admin || user.is_member || user.is_approved)) {
          toast.error("This action requires approved member privileges");
        }
        return !!user.is_admin || !!user.is_member || !!user.is_approved;
        
      case 'edit':
      case 'delete':
        if (!entityId || !createdBy) {
          if (showFeedback) {
            toast.error("Unable to verify permissions for this action");
          }
          return false;
        }
        
        // Creator can always edit/delete their own content
        const hasPermission = createdBy === user.id;
        if (showFeedback && !hasPermission) {
          toast.error(`You don't have permission to ${type} this item`);
        }
        return hasPermission;
        
      default:
        if (showFeedback) {
          toast.error("Invalid permission check");
        }
        return false;
    }
  }

  /**
   * Helper method for checking if a user can edit a specific event
   * @param user Current user profile
   * @param eventId ID of the event
   * @param createdBy ID of the user who created the event
   * @param showFeedback Whether to show toast feedback for permission issues
   * @returns Whether the user can edit the event
   */
  static async canEditEvent(
    user: Profile | null,
    eventId?: string,
    createdBy?: string,
    showFeedback: boolean = false
  ): Promise<boolean> {
    return this.hasPermission(user, 'edit', eventId, createdBy, showFeedback);
  }
  
  /**
   * Get human-readable permission error message
   * @param type Permission type
   * @returns User-friendly error message
   */
  static getPermissionErrorMessage(type: 'edit' | 'delete' | 'manage' | 'admin'): string {
    switch (type) {
      case 'admin':
        return 'This action requires administrator privileges';
      case 'manage':
        return 'This action requires approved member privileges';
      case 'edit':
        return 'You don\'t have permission to edit this item';
      case 'delete':
        return 'You don\'t have permission to delete this item';
      default:
        return 'You don\'t have permission to perform this action';
    }
  }
}

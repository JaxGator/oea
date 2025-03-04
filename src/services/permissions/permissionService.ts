
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/auth";

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
   * @returns Whether the user has permission
   */
  static async hasPermission(
    user: Profile | null,
    type: 'edit' | 'delete' | 'manage' | 'admin',
    entityId?: string,
    createdBy?: string
  ): Promise<boolean> {
    if (!user?.id) {
      return false;
    }
    
    // Admin/member/approved users always have all permissions
    if (user.is_admin || user.is_member || user.is_approved) {
      return true;
    }
    
    // Type-specific checks
    switch (type) {
      case 'admin':
        return !!user.is_admin;
        
      case 'manage':
        return !!user.is_admin || !!user.is_member || !!user.is_approved;
        
      case 'edit':
      case 'delete':
        if (!entityId || !createdBy) {
          return false;
        }
        
        // Creator can always edit/delete their own content
        return createdBy === user.id;
        
      default:
        return false;
    }
  }
}

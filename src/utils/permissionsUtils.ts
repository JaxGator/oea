
import { PermissionService } from "@/services/permissions/permissionService";
import type { Profile } from "@/types/auth";

/**
 * Checks if a user has permission to edit an event
 * @param userId The current user's ID
 * @param isAdmin Whether the user is an admin
 * @param canManageEvents Whether the user can manage events
 * @param createdBy The ID of the user who created the event
 * @returns Whether the user has permission to edit the event
 */
export function canEditEvent(
  userId: string | undefined,
  isAdmin: boolean,
  canManageEvents: boolean,
  createdBy: string
): boolean {
  // For debugging purposes, log all parameters
  
  // First, ensure we have a valid userId
  if (!userId) {
    return false;
  }
  
  // CRITICAL: Admin or anyone with canManageEvents should ALWAYS be able to edit ANY event
  // This includes admins, members and approved users - ALWAYS GRANT ACCESS TO THEM
  if (isAdmin || canManageEvents) {
    return true;
  }
  
  // Creator can edit their own events
  const isCreator = createdBy === userId;
  return isCreator;
}

/**
 * Checks if a user has permission to delete an event
 * @param userId The current user's ID
 * @param isAdmin Whether the user is an admin
 * @param canManageEvents Whether the user can manage events
 * @param createdBy The ID of the user who created the event
 * @returns Whether the user has permission to delete the event
 */
export function canDeleteEvent(
  userId: string | undefined,
  isAdmin: boolean,
  canManageEvents: boolean,
  createdBy: string
): boolean {
  // For debugging purposes, log all parameters
  
  if (!userId) {
    return false;
  }
  
  // CRITICAL: Admin or anyone with canManageEvents should ALWAYS be able to delete ANY event
  // This includes admins, members and approved users
  if (isAdmin || canManageEvents) {
    return true;
  }
  
  // Creator can delete their own events
  const isCreator = createdBy === userId;
  return isCreator;
}

/**
 * Helper function to check if a user is an administrator
 * @param user User profile
 * @returns Whether the user is an admin
 */
export function isAdministrator(user: Profile | null): boolean {
  return !!user?.is_admin;
}

/**
 * Helper function to check if a user is a member or approved user
 * @param user User profile
 * @returns Whether the user is a member or approved
 */
export function isMemberOrApproved(user: Profile | null): boolean {
  return !!user?.is_member || !!user?.is_approved;
}

/**
 * Helper function to check if a user can manage events
 * @param user User profile
 * @returns Whether the user can manage events
 */
export function canManageEvents(user: Profile | null): boolean {
  return isAdministrator(user) || isMemberOrApproved(user);
}

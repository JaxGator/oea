
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
  if (!userId) return false;
  
  return isAdmin || canManageEvents || createdBy === userId;
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
  if (!userId) return false;
  
  return isAdmin || canManageEvents || createdBy === userId;
}

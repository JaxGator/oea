
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
  // More detailed logging for debugging
  console.log("Permission check for edit:", {
    userId,
    isAdmin,
    canManageEvents,
    createdBy,
    hasPermission: isAdmin || canManageEvents || createdBy === userId,
    timestamp: new Date().toISOString()
  });
  
  // First, ensure we have a valid userId
  if (!userId) {
    console.log("Edit permission denied: No user ID provided");
    return false;
  }
  
  // Admin should always be able to edit any event
  if (isAdmin) {
    console.log("Edit permission granted: User is admin");
    return true;
  }
  
  // Users with event management permission can edit any event
  if (canManageEvents) {
    console.log("Edit permission granted: User can manage events");
    return true;
  }
  
  // Creator can edit their own events
  const isCreator = createdBy === userId;
  console.log(isCreator ? "Edit permission granted: User is event creator" : "Edit permission denied: User is not event creator");
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
  // More detailed logging for debugging
  console.log("Permission check for delete:", {
    userId,
    isAdmin,
    canManageEvents,
    createdBy,
    hasPermission: isAdmin || canManageEvents || createdBy === userId,
    timestamp: new Date().toISOString()
  });
  
  if (!userId) {
    console.log("Delete permission denied: No user ID provided");
    return false;
  }
  
  // Admin should always be able to delete any event
  if (isAdmin) {
    console.log("Delete permission granted: User is admin");
    return true;
  }
  
  // Users with event management permission can delete any event
  if (canManageEvents) {
    console.log("Delete permission granted: User can manage events");
    return true;
  }
  
  // Creator can delete their own events
  const isCreator = createdBy === userId;
  console.log(isCreator ? "Delete permission granted: User is event creator" : "Delete permission denied: User is not event creator");
  return isCreator;
}

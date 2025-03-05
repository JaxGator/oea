
export class PermissionService {
  /**
   * Returns a standardized error message for permission denials based on the type
   */
  static getPermissionErrorMessage(type: 'edit' | 'delete' | 'manage' | 'admin'): string {
    switch (type) {
      case 'admin':
        return 'This action requires administrator privileges';
      case 'manage':
        return 'This action requires approved member status';
      case 'edit':
        return 'You don\'t have permission to edit this item';
      case 'delete':
        return 'You don\'t have permission to delete this item';
      default:
        return 'You don\'t have permission to perform this action';
    }
  }

  /**
   * Returns a more detailed explanation for permission requirements
   */
  static getPermissionRequirements(type: 'edit' | 'delete' | 'manage' | 'admin'): string {
    switch (type) {
      case 'admin':
        return 'Only administrators can perform this action.';
      case 'manage':
        return 'This action requires you to be an approved member or administrator.';
      case 'edit':
      case 'delete':
        return 'You can only modify content that you created, unless you are an administrator or approved member.';
      default:
        return 'This action has specific permission requirements.';
    }
  }

  /**
   * Checks if a user has permission for a specific action
   */
  static hasPermission(
    user: any | null, 
    type: 'edit' | 'delete' | 'manage' | 'admin',
    entityId?: string,
    createdBy?: string
  ): boolean {
    if (!user) {
      return false;
    }

    // Admin has all permissions
    if (user.is_admin === true) {
      return true;
    }

    // For manage, edit, or delete actions, approved members have permission
    if ((type === 'manage' || type === 'edit' || type === 'delete') && 
        (user.is_member === true && user.is_approved === true)) {
      return true;
    }

    // For edit or delete actions, creators have permission for their own content
    if ((type === 'edit' || type === 'delete') && 
        createdBy && user.id === createdBy) {
      return true;
    }

    return false;
  }
}

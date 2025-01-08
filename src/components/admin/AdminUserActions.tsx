import { useState } from "react";
import { Member } from "../members/types";
import { EditUserButton } from "./user-management/actions/EditUserButton";
import { DeleteUserButton } from "./user-management/actions/DeleteUserButton";
import { MakeAdminButton } from "./user-management/actions/MakeAdminButton";
import { DeleteUserDialog } from "./user-management/DeleteUserDialog";

interface AdminUserActionsProps {
  profile: Member;
  onUpdateStatus: (username: string) => void;
  onEdit: (member: Member) => void;
  onDelete: (userId: string) => void;
  isUpdating: boolean;
}

export function AdminUserActions({ 
  profile, 
  onUpdateStatus, 
  onEdit,
  onDelete,
  isUpdating 
}: AdminUserActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleUpdateStatus = () => {
    if (!profile?.username) {
      console.error('AdminUserActions: Invalid profile data for status update:', profile);
      return;
    }
    console.log('AdminUserActions: Update status clicked for username:', profile.username);
    onUpdateStatus(profile.username);
  };

  const handleDelete = () => {
    if (!profile?.id) {
      console.error('AdminUserActions: Invalid profile data for deletion:', profile);
      return;
    }
    console.log('AdminUserActions: Delete confirmed for profile:', profile);
    onDelete(profile.id);
    setShowDeleteDialog(false);
  };

  // Validate profile data before rendering
  if (!profile?.id || !profile?.username) {
    console.error('AdminUserActions: Invalid profile data:', profile);
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <EditUserButton profile={profile} onEdit={onEdit} />
      <DeleteUserButton onShowDialog={() => setShowDeleteDialog(true)} />
      
      {!profile.is_admin && (
        <MakeAdminButton 
          onUpdateStatus={handleUpdateStatus}
          isUpdating={isUpdating}
        />
      )}

      <DeleteUserDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        username={profile.username}
      />
    </div>
  );
}
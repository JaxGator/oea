import { useState } from "react";
import { Member } from "../members/types";
import { EditUserButton } from "./user-management/actions/EditUserButton";
import { DeleteUserButton } from "./user-management/actions/DeleteUserButton";
import { MakeAdminButton } from "./user-management/actions/MakeAdminButton";
import { DeleteUserDialog } from "./user-management/DeleteUserDialog";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const validateProfile = (action: string): boolean => {
    if (!profile?.id || !profile?.username) {
      console.error(`AdminUserActions: Invalid profile data for ${action}:`, profile);
      toast({
        title: "Error",
        description: "Invalid user data. Please try again.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleUpdateStatus = () => {
    if (!validateProfile('status update')) return;
    console.log('AdminUserActions: Update status clicked for username:', profile.username);
    onUpdateStatus(profile.username);
  };

  const handleEdit = () => {
    if (!validateProfile('edit')) return;
    console.log('AdminUserActions: Edit clicked for profile:', profile);
    onEdit({
      ...profile,
      full_name: profile.full_name || '',
      avatar_url: profile.avatar_url || '',
      is_admin: profile.is_admin || false,
      is_approved: profile.is_approved || false,
      is_member: profile.is_member || false
    });
  };

  const handleDelete = () => {
    if (!validateProfile('deletion')) return;
    console.log('AdminUserActions: Delete confirmed for profile:', profile);
    onDelete(profile.id);
    setShowDeleteDialog(false);
  };

  if (!validateProfile('render')) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <EditUserButton profile={profile} onEdit={handleEdit} />
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
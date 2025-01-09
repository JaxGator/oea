import { TableRow, TableCell } from "@/components/ui/table";
import { UserStatusBadges } from "./UserStatusBadges";
import { AdminUserActions } from "../AdminUserActions";
import { Member } from "@/components/members/types";

interface Profile extends Member {}

interface AdminUserTableRowProps {
  profile: Profile;
  onEdit: (profile: Profile) => void;
  onUpdateStatus: (username: string) => void;
  onDelete: (userId: string) => void;
  isUpdating: boolean;
}

export function AdminUserTableRow({
  profile,
  onEdit,
  onUpdateStatus,
  onDelete,
  isUpdating
}: AdminUserTableRowProps) {
  console.log('AdminUserTableRow render:', { profile });

  if (!profile?.id || !profile?.username) {
    console.warn('Invalid profile data:', profile);
    return null;
  }

  const handleEdit = () => {
    console.log('Handling edit for profile:', profile);
    onEdit(profile);
  };

  return (
    <TableRow>
      <TableCell className="py-4">
        <div className="flex flex-col gap-1">
          <span className="font-medium">{profile.username}</span>
          <span className="text-sm text-gray-500">{profile.full_name || '-'}</span>
          <div className="flex flex-wrap gap-1 md:hidden mt-2">
            <UserStatusBadges 
              isAdmin={profile.is_admin}
              isApproved={profile.is_approved}
              isMember={profile.is_member}
            />
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex flex-wrap gap-1">
          <UserStatusBadges 
            isAdmin={profile.is_admin}
            isApproved={profile.is_approved}
            isMember={profile.is_member}
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-end">
          <AdminUserActions
            profile={profile}
            onEdit={handleEdit}
            onUpdateStatus={onUpdateStatus}
            onDelete={onDelete}
            isUpdating={isUpdating}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

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

  const handleDelete = () => {
    console.log('AdminUserTableRow: Delete clicked for user:', profile.id);
    onDelete(profile.id);
  };

  const handleEdit = () => {
    console.log('AdminUserTableRow: Edit clicked for profile:', profile);
    onEdit(profile);
  };

  return (
    <TableRow className="group hover:bg-muted/50">
      <TableCell className="py-4">
        <div className="flex flex-col gap-1">
          <span className="font-medium truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
            {profile.username}
          </span>
          <span className="text-sm text-muted-foreground truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
            {profile.full_name || '-'}
          </span>
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
      <TableCell className="w-[100px]">
        <div className="flex justify-end">
          <AdminUserActions
            profile={profile}
            onEdit={handleEdit}
            onUpdateStatus={onUpdateStatus}
            onDelete={handleDelete}
            isUpdating={isUpdating}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

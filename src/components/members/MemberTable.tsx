import { Member } from "./types";
import { MemberTableRow } from "./MemberTableRow";
import { useMembers } from "@/hooks/useMembers";

interface MemberTableProps {
  members: Member[];
  currentUserIsAdmin: boolean;
  onViewMember: (member: Member) => void;
  onEditMember: (member: Member) => void;
  onDeleteMember?: (userId: string) => void;
}

export function MemberTable({ 
  members, 
  currentUserIsAdmin, 
  onViewMember, 
  onEditMember,
  onDeleteMember 
}: MemberTableProps) {
  const { handleDeleteMember: defaultHandleDelete } = useMembers();

  const handleDelete = onDeleteMember || defaultHandleDelete;

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Username</th>
            <th scope="col" className="px-6 py-3">Full Name</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <MemberTableRow
              key={member.id}
              member={member}
              isCurrentUserAdmin={currentUserIsAdmin}
              onEdit={onEditMember}
              onDelete={handleDelete}
              onView={onViewMember}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
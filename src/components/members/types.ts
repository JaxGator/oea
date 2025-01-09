export interface Member {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
  created_at: string;
  event_reminders_enabled: boolean | null;
}

export interface MemberTableProps {
  members: Member[];
  currentUserIsAdmin: boolean;
  onViewMember: (member: Member) => void;
  onEditMember: (member: Member) => void;
  onDeleteMember?: (userId: string) => void;
}
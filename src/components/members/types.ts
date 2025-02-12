
export interface Member {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
  created_at: string;
  event_reminders_enabled: boolean;
  email: string | null;
  email_notifications: boolean;
  in_app_notifications: boolean;
  interests: string[] | null;
  updated_at: string | null;
  leaderboard_opt_out: boolean;
}

export interface MemberTableProps {
  members: Member[];
  currentUserIsAdmin: boolean;
  onViewMember: (member: Member) => void;
  onEditMember: (member: Member) => void;
  onDeleteMember?: (userId: string) => void;
}


export interface Member {
  id: string;
  username: string;
  avatar_url: string | null;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
  created_at: string;
  event_reminders_enabled: boolean;
  leaderboard_metrics?: {
    events_attended: number | null;
    events_hosted: number | null;
    current_streak: number | null;
    total_contributions: number | null;
  } | null;
}

export interface MemberTableProps {
  members: Member[];
  currentUserIsAdmin: boolean;
  onViewMember: (member: Member) => void;
  onEditMember: (member: Member) => void;
  onDeleteMember?: (userId: string) => void;
}


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

// Add utility function to transform partial member data to full member
export const createMemberFromPartial = (partial: Partial<Member>): Member => ({
  id: partial.id || '',
  username: partial.username || '',
  full_name: partial.full_name || null,
  avatar_url: partial.avatar_url || null,
  is_admin: partial.is_admin || false,
  is_approved: partial.is_approved || false,
  is_member: partial.is_member || false,
  created_at: partial.created_at || new Date().toISOString(),
  event_reminders_enabled: partial.event_reminders_enabled || false,
  email: partial.email || null,
  email_notifications: partial.email_notifications || false,
  in_app_notifications: partial.in_app_notifications || false,
  interests: partial.interests || null,
  updated_at: partial.updated_at || null,
  leaderboard_opt_out: partial.leaderboard_opt_out || false,
});


export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
  email?: string | null;
  event_reminders_enabled: boolean;
  email_notifications?: boolean;
  in_app_notifications?: boolean;
  interests?: string[];
}

export interface AuthState {
  isLoading: boolean;
  user: Profile | null;
  profile: Profile | null;
}

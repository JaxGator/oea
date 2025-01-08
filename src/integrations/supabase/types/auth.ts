export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  is_admin: boolean | null;
  is_approved: boolean | null;
  is_member: boolean | null;
  email_notifications: boolean | null;
  in_app_notifications: boolean | null;
  event_reminders_enabled: boolean | null;
};
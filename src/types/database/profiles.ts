
import { Json } from './base';

export interface ProfilesTable {
  Row: {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
    is_admin: boolean;
    is_approved: boolean;
    is_member: boolean;
    email: string | null;
    event_reminders_enabled: boolean;
    email_notifications: boolean;
    in_app_notifications: boolean;
    interests: string[] | null;
    updated_at: string | null;
    leaderboard_opt_out: boolean;
  };
  Insert: {
    id: string;
    username: string;
    full_name?: string | null;
    avatar_url?: string | null;
    created_at?: string;
    is_admin?: boolean;
    is_approved?: boolean;
    is_member?: boolean;
    email?: string | null;
    event_reminders_enabled?: boolean;
    email_notifications?: boolean;
    in_app_notifications?: boolean;
    interests?: string[] | null;
    updated_at?: string | null;
    leaderboard_opt_out?: boolean;
  };
  Update: {
    id?: string;
    username?: string;
    full_name?: string | null;
    avatar_url?: string | null;
    created_at?: string;
    is_admin?: boolean;
    is_approved?: boolean;
    is_member?: boolean;
    email?: string | null;
    event_reminders_enabled?: boolean;
    email_notifications?: boolean;
    in_app_notifications?: boolean;
    interests?: string[] | null;
    updated_at?: string | null;
    leaderboard_opt_out?: boolean;
  };
}

export type Profile = ProfilesTable['Row'];

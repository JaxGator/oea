import { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
  created_at: string;
  has_unread_messages?: boolean; // Added this optional property
}

export interface AuthState {
  isLoading: boolean;
  user: User | null;
  profile: Profile | null;
}
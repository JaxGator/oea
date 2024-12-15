import { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean | null;
  is_approved: boolean | null;
  is_member: boolean | null;
  created_at?: string;
}

export interface AuthState {
  isLoading: boolean;
  user: User | null;
  profile: Profile | null;
}
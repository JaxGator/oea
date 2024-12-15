import { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
}

export interface AuthState {
  isLoading: boolean;
  user: User | null;
  profile: Profile | null;
}
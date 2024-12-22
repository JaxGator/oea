export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  is_admin: boolean | null;
  is_approved: boolean | null;
  is_member: boolean | null;
}

export interface ProfileInsert extends Omit<Profile, 'id' | 'created_at'> {
  id?: string;
  created_at?: string;
}

export interface ProfileUpdate extends Partial<ProfileInsert> {}
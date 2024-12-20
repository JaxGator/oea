export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
}

export type ProfileInsert = Omit<Profile, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type ProfileUpdate = Partial<Profile>;
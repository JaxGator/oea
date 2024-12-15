export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface AdminLog {
  id: string;
  admin_id: string;
  action_type: string;
  target_type: string;
  target_id: string;
  details: Json | null;
  created_at: string;
}

export interface EventRSVP {
  id: string;
  event_id: string;
  user_id: string;
  response: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  max_guests: number;
  created_by: string;
  created_at: string;
  image_url: string;
}

export interface MediaAlbum {
  id: string;
  title: string;
  description: string | null;
  created_by: string;
  created_at: string;
}

export interface MediaItem {
  id: string;
  album_id: string | null;
  file_path: string;
  file_type: string;
  title: string | null;
  description: string | null;
  created_by: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

export interface PageContent {
  id: string;
  page_id: string;
  section_id: string;
  content: string;
  updated_by: string | null;
  updated_at: string | null;
  created_at: string | null;
}

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  is_admin: boolean | null;
  is_approved: boolean | null;
}
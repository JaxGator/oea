import {
  AdminLog,
  EventRSVP,
  Event,
  MediaAlbum,
  MediaItem,
  Message,
  PageContent,
  Profile,
  Json
} from './tables';

export type Database = {
  public: {
    Tables: {
      admin_logs: {
        Row: AdminLog;
        Insert: Omit<AdminLog, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<AdminLog>;
      };
      event_rsvps: {
        Row: EventRSVP;
        Insert: Omit<EventRSVP, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<EventRSVP>;
      };
      events: {
        Row: Event;
        Insert: Omit<Event, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Event>;
      };
      media_albums: {
        Row: MediaAlbum;
        Insert: Omit<MediaAlbum, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<MediaAlbum>;
      };
      media_items: {
        Row: MediaItem;
        Insert: Omit<MediaItem, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<MediaItem>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Message>;
      };
      page_content: {
        Row: PageContent;
        Insert: Omit<PageContent, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<PageContent>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'> & {
          created_at?: string;
        };
        Update: Partial<Profile>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_profile: {
        Args: {
          user_id: string;
          user_username: string;
          user_full_name?: string;
          user_avatar_url?: string;
          user_is_admin?: boolean;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
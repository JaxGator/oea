import { AdminLog, Json } from './admin';
import { Profile } from './auth';
import { Event, EventRSVP, EventGuest } from './events';
import { GalleryAlbum, GalleryImage } from './gallery';
import { PageContent, SiteConfig } from './site';
import { UserBlock } from './user';

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
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'> & {
          created_at?: string;
        };
        Update: Partial<Profile>;
      };
      events: {
        Row: Event;
        Insert: Omit<Event, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Event>;
      };
      event_rsvps: {
        Row: EventRSVP;
        Insert: Omit<EventRSVP, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<EventRSVP>;
      };
      event_guests: {
        Row: EventGuest;
        Insert: Omit<EventGuest, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<EventGuest>;
      };
      gallery_albums: {
        Row: GalleryAlbum;
        Insert: Omit<GalleryAlbum, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<GalleryAlbum>;
      };
      gallery_images: {
        Row: GalleryImage;
        Insert: Omit<GalleryImage, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<GalleryImage>;
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
      site_config: {
        Row: SiteConfig;
        Insert: Omit<SiteConfig, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<SiteConfig>;
      };
      user_blocks: {
        Row: UserBlock;
        Insert: Omit<UserBlock, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<UserBlock>;
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T];
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;
export type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
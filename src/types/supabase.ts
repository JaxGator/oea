import { Database as GeneratedDatabase } from '@/integrations/supabase/types';

export type Database = GeneratedDatabase;

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Helper type for handling Supabase query results
export type DBResult<T> = T extends PromiseLike<infer U> ? U : T;

// Common table types
export type Profile = Tables<'profiles'>;
export type Event = Tables<'events'>;
export type EventRSVP = Tables<'event_rsvps'>;
export type EventGuest = Tables<'event_guests'>;
export type Message = Tables<'messages'>;
export type PageContent = Tables<'page_content'>;
export type GalleryAlbum = Tables<'gallery_albums'>;
export type GalleryImage = Tables<'gallery_images'>;
export type SiteConfig = Tables<'site_config'>;
export type AdminLog = Tables<'admin_logs'>;

// Insert types
export type ProfileInsert = InsertTables<'profiles'>;
export type EventInsert = InsertTables<'events'>;
export type EventRSVPInsert = InsertTables<'event_rsvps'>;
export type EventGuestInsert = InsertTables<'event_guests'>;
export type MessageInsert = InsertTables<'messages'>;
export type PageContentInsert = InsertTables<'page_content'>;
export type GalleryAlbumInsert = InsertTables<'gallery_albums'>;
export type GalleryImageInsert = InsertTables<'gallery_images'>;
export type SiteConfigInsert = InsertTables<'site_config'>;
export type AdminLogInsert = InsertTables<'admin_logs'>;

// Update types
export type ProfileUpdate = UpdateTables<'profiles'>;
export type EventUpdate = UpdateTables<'events'>;
export type EventRSVPUpdate = UpdateTables<'event_rsvps'>;
export type EventGuestUpdate = UpdateTables<'event_guests'>;
export type MessageUpdate = UpdateTables<'messages'>;
export type PageContentUpdate = UpdateTables<'page_content'>;
export type GalleryAlbumUpdate = UpdateTables<'gallery_albums'>;
export type GalleryImageUpdate = UpdateTables<'gallery_images'>;
export type SiteConfigUpdate = UpdateTables<'site_config'>;
export type AdminLogUpdate = UpdateTables<'admin_logs'>;

// Enum types
export type RSVPResponse = Enums<'rsvp_response'>;
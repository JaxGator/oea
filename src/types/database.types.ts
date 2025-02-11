
import { Database } from '@/integrations/supabase/types/database'
export type { Database } from '@/integrations/supabase/types/database'

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Create specific types for commonly used tables
export type Profile = Tables<'profiles'>
export type Event = Tables<'events'>
export type EventRSVP = Tables<'event_rsvps'>
export type EventGuest = Tables<'event_guests'>
export type SocialMediaFeed = Tables<'social_media_feeds'>

// Type for social media feed with expanded relationships
export interface SocialMediaFeedWithRelations extends SocialMediaFeed {
  profiles?: Profile | null
}

// Type for RSVP with expanded relationships
export interface EventRSVPWithProfile extends EventRSVP {
  profiles?: Profile | null;
  event_guests?: EventGuest[];
}

// Helper type for query responses
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never

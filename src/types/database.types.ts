
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
export type Poll = Tables<'polls'>
export type PollOption = Tables<'poll_options'>
export type PollVote = Tables<'poll_votes'>

// Type for vote results from database function
export type VoteResult = 'success' | 'already_voted' | 'poll_closed' | 'not_found'

// Extended types with relationships
export interface SocialMediaFeedWithRelations extends SocialMediaFeed {
  profiles?: Profile | null
}

export interface EventRSVPWithProfile extends EventRSVP {
  profiles?: Profile | null;
  event_guests?: EventGuest[];
}

export interface PollWithDetails extends Poll {
  poll_options: (PollOption & {
    vote_count?: number;
    has_voted?: boolean;
  })[];
  total_votes?: number;
}

// Helper type for query responses
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never

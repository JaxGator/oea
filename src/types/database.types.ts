
import { Database } from '@/integrations/supabase/types/database'
export type { Database } from '@/integrations/supabase/types/database'

// Basic table types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Common table types
export type Profile = Tables<'profiles'>
export type Event = Tables<'events'>
export type EventRSVP = Tables<'event_rsvps'>
export type EventGuest = Tables<'event_guests'>
export type SocialMediaFeed = Tables<'social_media_feeds'>
export type Poll = Tables<'polls'>
export type PollOption = Tables<'poll_options'>
export type PollVote = Tables<'poll_votes'>

// Specific extended types
export interface EventRSVPWithProfile extends EventRSVP {
  profiles?: Profile | null;
  event_guests?: EventGuest[];
}

export interface PollOptionWithVotes extends PollOption {
  vote_count?: number;
  has_voted?: boolean;
}

export interface PollWithDetails extends Poll {
  poll_options: PollOptionWithVotes[];
  total_votes?: number;
}

// Database function return types
export type VoteResult = 'success' | 'already_voted' | 'poll_closed' | 'not_found'

// View types
export interface PollVoteCount {
  poll_id: string;
  option_id: string;
  vote_count: number;
}

// Helper types for database queries
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never

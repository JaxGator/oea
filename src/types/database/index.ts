
import type { Json } from './base';
import type { ProfilesTable, Profile } from './profiles';
import type { EventsTable, Event, EventGuest, EventRSVP } from './events';
import type { PollsTable, PollOptionsTable, Poll, PollOption, PollVote } from './polls';
import type { SocialMediaFeedsTable } from './social';
import type { EventRSVPsTable } from './rsvp';

export interface Database {
  public: {
    Tables: {
      profiles: ProfilesTable;
      events: EventsTable;
      polls: PollsTable;
      poll_options: PollOptionsTable;
      social_media_feeds: SocialMediaFeedsTable;
      event_rsvps: EventRSVPsTable;
    };
    Functions: {
      handle_poll_vote: {
        Args: { p_poll_id: string; p_option_id: string; p_user_id: string };
        Returns: 'success' | 'already_voted' | 'poll_closed' | 'not_found';
      };
    };
    Enums: {
      poll_status: 'active' | 'closed';
      poll_visibility: 'public' | 'private';
    };
  };
}

export * from './base';
export * from './profiles';
export * from './events';
export * from './polls';
export * from './social';
export * from './rsvp';

// Re-export utility types
export type TableRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Event-specific types
export interface EventsPage {
  data: Event[];
  count: number;
  nextPage: number | null;
}

export interface EventRSVPWithProfile extends EventRSVP {
  profiles?: Profile;
  event_guests?: EventGuest[];
}

export interface PollWithDetails extends Poll {
  poll_options: (PollOption & {
    has_voted?: boolean;
    vote_count?: number;
  })[];
  total_votes?: number;
  poll_votes?: PollVote[];
}

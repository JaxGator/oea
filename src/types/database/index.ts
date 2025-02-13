
import type { Json } from './base';
import type { ProfilesTable } from './profiles';
import type { EventsTable } from './events';
import type { PollsTable, PollOptionsTable } from './polls';
import type { SocialMediaFeedsTable } from './social';

export interface Database {
  public: {
    Tables: {
      profiles: ProfilesTable;
      events: EventsTable;
      polls: PollsTable;
      poll_options: PollOptionsTable;
      social_media_feeds: SocialMediaFeedsTable;
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

// Re-export utility types
export type TableRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

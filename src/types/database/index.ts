import type { Json } from './base';
import type { ProfilesTable } from './profiles';
import type { EventsTable } from './events';
import type { PollsTable, PollOptionsTable } from './polls';

export interface Database {
  public: {
    Tables: {
      profiles: ProfilesTable;
      events: EventsTable;
      polls: PollsTable;
      poll_options: PollOptionsTable;
      // ... other tables can be added here
    };
    Functions: {
      handle_poll_vote: {
        Args: { p_poll_id: string; p_option_id: string; p_user_id: string };
        Returns: VoteResult;
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

// Re-export utility types
export type TableRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

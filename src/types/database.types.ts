export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          is_admin: boolean;
          is_approved: boolean;
          is_member: boolean;
          email: string | null;
          event_reminders_enabled: boolean;
          email_notifications: boolean;
          in_app_notifications: boolean;
          interests: string[] | null;
          updated_at: string | null;
          leaderboard_opt_out: boolean;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          is_admin?: boolean;
          is_approved?: boolean;
          is_member?: boolean;
          email?: string | null;
          event_reminders_enabled?: boolean;
          email_notifications?: boolean;
          in_app_notifications?: boolean;
          interests?: string[] | null;
          updated_at?: string | null;
          leaderboard_opt_out?: boolean;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          is_admin?: boolean;
          is_approved?: boolean;
          is_member?: boolean;
          email?: string | null;
          event_reminders_enabled?: boolean;
          email_notifications?: boolean;
          in_app_notifications?: boolean;
          interests?: string[] | null;
          updated_at?: string | null;
          leaderboard_opt_out?: boolean;
        };
      };
      events: {
        Row: {
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
          is_featured: boolean;
          is_published: boolean;
          imported_rsvp_count: number | null;
          waitlist_enabled: boolean;
          waitlist_capacity: number | null;
          end_time: string | null;
          latitude: number | null;
          longitude: number | null;
          reminder_enabled: boolean;
          reminder_intervals: string[];
          requires_payment: boolean;
          ticket_price: number | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          date: string;
          time: string;
          location: string;
          max_guests: number;
          created_by: string;
          created_at?: string;
          image_url: string;
          is_featured?: boolean;
          is_published?: boolean;
          imported_rsvp_count?: number | null;
          waitlist_enabled?: boolean;
          waitlist_capacity?: number | null;
          end_time?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          reminder_enabled?: boolean;
          reminder_intervals?: string[];
          requires_payment?: boolean;
          ticket_price?: number | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          date?: string;
          time?: string;
          location?: string;
          max_guests?: number;
          created_by?: string;
          created_at?: string;
          image_url?: string;
          is_featured?: boolean;
          is_published?: boolean;
          imported_rsvp_count?: number | null;
          waitlist_enabled?: boolean;
          waitlist_capacity?: number | null;
          end_time?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          reminder_enabled?: boolean;
          reminder_intervals?: string[];
          requires_payment?: boolean;
          ticket_price?: number | null;
        };
      };
      event_rsvps: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          response: 'attending' | 'not_attending' | 'maybe';
          created_at: string;
          status: 'confirmed' | 'waitlisted';
          send_confirmation_email: boolean;
          profiles?: Profile;
          event_guests?: EventGuest[];
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          response: 'attending' | 'not_attending' | 'maybe';
          created_at?: string;
          status?: 'confirmed' | 'waitlisted';
          send_confirmation_email?: boolean;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          response?: 'attending' | 'not_attending' | 'maybe';
          created_at?: string;
          status?: 'confirmed' | 'waitlisted';
          send_confirmation_email?: boolean;
        };
      };
      polls: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          created_at: string;
          created_by: string;
          status: 'active' | 'closed';
          share_token: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          created_at?: string;
          created_by: string;
          status?: 'active' | 'closed';
          share_token?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          created_at?: string;
          created_by?: string;
          status?: 'active' | 'closed';
          share_token?: string | null;
        };
      };
      poll_options: {
        Row: {
          id: string;
          poll_id: string;
          option_text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          option_text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          option_text?: string;
          created_at?: string;
        };
      };
      social_media_feeds: {
        Row: {
          id: string;
          platform: string;
          feed_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          platform: string;
          feed_url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          platform?: string;
          feed_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type TableNames = keyof Database['public']['Tables'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Event = Database['public']['Tables']['events']['Row'] & {
  rsvps?: EventRSVP[];
  attendees?: Profile[];
  guests?: EventGuest[];
};

export type EventRSVP = Database['public']['Tables']['event_rsvps']['Row'] & {
  profiles?: Profile;
  event_guests?: EventGuest[];
};

export type EventGuest = {
  id: string;
  first_name: string | null;
};

export type PollWithDetails = Poll & {
  poll_options: (PollOption & {
    has_voted?: boolean;
    vote_count?: number;
  })[];
  total_votes?: number;
};

export type Poll = Database['public']['Tables']['polls']['Row'];
export type PollOption = Database['public']['Tables']['poll_options']['Row'];
export type SocialMediaFeed = Database['public']['Tables']['social_media_feeds']['Row'];

// Type guards for database operations
export function isQueryError<T>(result: T | { error: true }): result is { error: true } {
  return result && typeof result === 'object' && 'error' in result;
}

export function isQuerySuccess<T>(result: T | { error: true }): result is T {
  return !isQueryError(result);
}

// Database operation result types
export type DbResult<T> = Promise<T | { error: true }>;
export type DbResultOk<T> = Promise<T>;

export type QueryResult<T> = {
  data: T | null;
  error: {
    message: string;
    code?: string;
    details?: string;
  } | null;
};

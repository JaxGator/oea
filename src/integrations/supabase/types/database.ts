
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
        };
      };
      event_rsvps: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          response: string;
          created_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          response: string;
          created_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          response?: string;
          created_at?: string;
          status?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T];
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;
export type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];


export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
        }
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
        }
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
        }
      }
      event_rsvps: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          response: 'attending' | 'not_attending' | 'maybe';
          status: 'confirmed' | 'waitlisted';
          created_at: string;
          send_confirmation_email: boolean;
        }
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          response: 'attending' | 'not_attending' | 'maybe';
          status?: 'confirmed' | 'waitlisted';
          created_at?: string;
          send_confirmation_email?: boolean;
        }
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          response?: 'attending' | 'not_attending' | 'maybe';
          status?: 'confirmed' | 'waitlisted';
          created_at?: string;
          send_confirmation_email?: boolean;
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      event_guests: {
        Row: {
          id: string;
          rsvp_id: string;
          first_name: string | null;
          created_at: string;
        }
        Insert: {
          id?: string;
          rsvp_id: string;
          first_name?: string | null;
          created_at?: string;
        }
        Update: {
          id?: string;
          rsvp_id?: string;
          first_name?: string | null;
          created_at?: string;
        }
        Relationships: [
          {
            foreignKeyName: "event_guests_rsvp_id_fkey"
            columns: ["rsvp_id"]
            isOneToOne: false
            referencedRelation: "event_rsvps"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      message_status: 'draft' | 'scheduled' | 'sent' | 'failed'
      recipient_type: 'all' | 'list' | 'individual'
      poll_status: 'draft' | 'active' | 'closed'
      poll_visibility: 'public' | 'private'
      notification_type: 'event_reminder' | 'message' | 'poll_share' | 'waitlist'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
export type TableRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

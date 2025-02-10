
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
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          is_admin: boolean
          is_approved: boolean
          is_member: boolean
          email: string | null
          event_reminders_enabled: boolean
          email_notifications: boolean
          in_app_notifications: boolean
          interests: string[] | null
          updated_at: string | null
          leaderboard_opt_out: boolean
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          is_admin?: boolean
          is_approved?: boolean
          is_member?: boolean
          email?: string | null
          event_reminders_enabled?: boolean
          email_notifications?: boolean
          in_app_notifications?: boolean
          interests?: string[] | null
          updated_at?: string | null
          leaderboard_opt_out?: boolean
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          is_admin?: boolean
          is_approved?: boolean
          is_member?: boolean
          email?: string | null
          event_reminders_enabled?: boolean
          email_notifications?: boolean
          in_app_notifications?: boolean
          interests?: string[] | null
          updated_at?: string | null
          leaderboard_opt_out?: boolean
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          time: string
          location: string
          max_guests: number
          created_by: string
          created_at: string
          image_url: string
          is_featured: boolean
          is_published: boolean
          imported_rsvp_count: number | null
          waitlist_enabled: boolean
          waitlist_capacity: number | null
          end_time: string | null
          latitude: number | null
          longitude: number | null
          reminder_enabled: boolean
          reminder_intervals: string[]
          requires_payment: boolean
          ticket_price: number | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          time: string
          location: string
          max_guests: number
          created_by: string
          created_at?: string
          image_url: string
          is_featured?: boolean
          is_published?: boolean
          imported_rsvp_count?: number | null
          waitlist_enabled?: boolean
          waitlist_capacity?: number | null
          end_time?: string | null
          latitude?: number | null
          longitude?: number | null
          reminder_enabled?: boolean
          reminder_intervals?: string[]
          requires_payment?: boolean
          ticket_price?: number | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          time?: string
          location?: string
          max_guests?: number
          created_by?: string
          created_at?: string
          image_url?: string
          is_featured?: boolean
          is_published?: boolean
          imported_rsvp_count?: number | null
          waitlist_enabled?: boolean
          waitlist_capacity?: number | null
          end_time?: string | null
          latitude?: number | null
          longitude?: number | null
          reminder_enabled?: boolean
          reminder_intervals?: string[]
          requires_payment?: boolean
          ticket_price?: number | null
        }
      }
      event_rsvps: {
        Row: {
          id: string
          event_id: string
          user_id: string
          response: string
          created_at: string
          status: string
          send_confirmation_email: boolean
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          response: string
          created_at?: string
          status?: string
          send_confirmation_email?: boolean
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          response?: string
          created_at?: string
          status?: string
          send_confirmation_email?: boolean
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
      gallery_images: {
        Row: {
          id: string
          file_name: string
          user_id: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          file_name: string
          user_id: string
          display_order: number
          created_at?: string
        }
        Update: {
          id?: string
          file_name?: string
          user_id?: string
          display_order?: number
          created_at?: string
        }
      }
      site_config: {
        Row: {
          id: string
          key: string
          value: string
          updated_by: string | null
          updated_at: string | null
          created_at: string | null
          verification_status: boolean | null
        }
        Insert: {
          id?: string
          key: string
          value: string
          updated_by?: string | null
          updated_at?: string | null
          created_at?: string | null
          verification_status?: boolean | null
        }
        Update: {
          id?: string
          key?: string
          value?: string
          updated_by?: string | null
          updated_at?: string | null
          created_at?: string | null
          verification_status?: boolean | null
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          created_at: string
          is_read: boolean
          read_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content: string
          created_at?: string
          is_read?: boolean
          read_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          created_at?: string
          is_read?: boolean
          read_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          created_at: string
          is_read: boolean
          related_entity_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          created_at?: string
          is_read?: boolean
          related_entity_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          created_at?: string
          is_read?: boolean
          related_entity_id?: string | null
        }
      }
      polls: {
        Row: {
          id: string
          title: string
          description: string | null
          created_by: string
          created_at: string
          updated_at: string
          status: string
          visibility: string
          start_date: string | null
          end_date: string | null
          allow_multiple_choices: boolean
          share_token: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          status?: string
          visibility?: string
          start_date?: string | null
          end_date?: string | null
          allow_multiple_choices?: boolean
          share_token?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          status?: string
          visibility?: string
          start_date?: string | null
          end_date?: string | null
          allow_multiple_choices?: boolean
          share_token?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
export type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

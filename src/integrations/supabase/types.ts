export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          target_id: string
          target_type: string
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id: string
          target_type: string
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      communications: {
        Row: {
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          recipient_data: Json
          recipient_type: Database["public"]["Enums"]["recipient_type"]
          scheduled_for: string | null
          sender_id: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["message_status"] | null
          subject: string
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          recipient_data: Json
          recipient_type: Database["public"]["Enums"]["recipient_type"]
          scheduled_for?: string | null
          sender_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          subject: string
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          recipient_data?: Json
          recipient_type?: Database["public"]["Enums"]["recipient_type"]
          scheduled_for?: string | null
          sender_id?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          subject?: string
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      event_guests: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          rsvp_id: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: string
          rsvp_id: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          rsvp_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_guests_rsvp_id_fkey"
            columns: ["rsvp_id"]
            isOneToOne: false
            referencedRelation: "event_rsvps"
            referencedColumns: ["id"]
          },
        ]
      }
      event_reminders: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          notification_status: string | null
          reminder_time: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          notification_status?: string | null
          reminder_time: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          notification_status?: string | null
          reminder_time?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_reminders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_reminders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          id: string
          response: Database["public"]["Enums"]["rsvp_response"]
          send_confirmation_email: boolean | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          response: Database["public"]["Enums"]["rsvp_response"]
          send_confirmation_email?: boolean | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          response?: Database["public"]["Enums"]["rsvp_response"]
          send_confirmation_email?: boolean | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_public_view"
            referencedColumns: ["id"]
          },
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
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string
          date: string
          description: string | null
          display_order: number | null
          end_time: string | null
          id: string
          image_url: string
          imported_rsvp_count: number | null
          is_featured: boolean | null
          is_published: boolean | null
          location: string
          max_guests: number
          reminder_enabled: boolean | null
          reminder_intervals: Json | null
          requires_payment: boolean | null
          ticket_price: number | null
          time: string
          title: string
          waitlist_capacity: number | null
          waitlist_enabled: boolean | null
        }
        Insert: {
          created_at?: string
          created_by: string
          date: string
          description?: string | null
          display_order?: number | null
          end_time?: string | null
          id?: string
          image_url: string
          imported_rsvp_count?: number | null
          is_featured?: boolean | null
          is_published?: boolean | null
          location: string
          max_guests: number
          reminder_enabled?: boolean | null
          reminder_intervals?: Json | null
          requires_payment?: boolean | null
          ticket_price?: number | null
          time: string
          title: string
          waitlist_capacity?: number | null
          waitlist_enabled?: boolean | null
        }
        Update: {
          created_at?: string
          created_by?: string
          date?: string
          description?: string | null
          display_order?: number | null
          end_time?: string | null
          id?: string
          image_url?: string
          imported_rsvp_count?: number | null
          is_featured?: boolean | null
          is_published?: boolean | null
          location?: string
          max_guests?: number
          reminder_enabled?: boolean | null
          reminder_intervals?: Json | null
          requires_payment?: boolean | null
          ticket_price?: number | null
          time?: string
          title?: string
          waitlist_capacity?: number | null
          waitlist_enabled?: boolean | null
        }
        Relationships: []
      }
      gallery_albums: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          event_id: string | null
          folder_path: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          event_id?: string | null
          folder_path: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          event_id?: string | null
          folder_path?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_albums_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_albums_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_albums_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          created_at: string
          display_order: number
          file_name: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_order: number
          file_name: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          file_name?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      leaderboard_badges: {
        Row: {
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          name: string
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
          requirement_type: string
          requirement_value: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      leaderboard_metrics: {
        Row: {
          created_at: string | null
          current_streak: number | null
          events_attended: number | null
          events_hosted: number | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          monthly_points: number | null
          total_contributions: number | null
          updated_at: string | null
          user_id: string | null
          weekly_points: number | null
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          events_attended?: number | null
          events_hosted?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          monthly_points?: number | null
          total_contributions?: number | null
          updated_at?: string | null
          user_id?: string | null
          weekly_points?: number | null
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          events_attended?: number | null
          events_hosted?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          monthly_points?: number | null
          total_contributions?: number | null
          updated_at?: string | null
          user_id?: string | null
          weekly_points?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      list_members: {
        Row: {
          added_at: string | null
          list_id: string
          member_id: string
        }
        Insert: {
          added_at?: string | null
          list_id: string
          member_id: string
        }
        Update: {
          added_at?: string | null
          list_id?: string
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "list_members_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "recipient_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "list_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_delivery: {
        Row: {
          communication_id: string | null
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          id: string
          opened_at: string | null
          recipient_id: string | null
          status: Database["public"]["Enums"]["message_status"]
          updated_at: string | null
        }
        Insert: {
          communication_id?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          opened_at?: string | null
          recipient_id?: string | null
          status: Database["public"]["Enums"]["message_status"]
          updated_at?: string | null
        }
        Update: {
          communication_id?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          opened_at?: string | null
          recipient_id?: string | null
          status?: Database["public"]["Enums"]["message_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_delivery_communication_id_fkey"
            columns: ["communication_id"]
            isOneToOne: false
            referencedRelation: "communications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_delivery_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_templates: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          receiver_id: string
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id: string
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id?: string
          sender_id?: string
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
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_entity_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_entity_id?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_entity_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      page_content: {
        Row: {
          content: string
          created_at: string | null
          id: string
          page_id: string
          section_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          page_id: string
          section_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          page_id?: string
          section_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          event_id: string
          id: string
          payment_method: string | null
          status: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          event_id: string
          id?: string
          payment_method?: string | null
          status: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          event_id?: string
          id?: string
          payment_method?: string | null
          status?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email_notifications: boolean | null
          event_reminders_enabled: boolean | null
          full_name: string | null
          id: string
          in_app_notifications: boolean | null
          interests: string[] | null
          is_admin: boolean | null
          is_approved: boolean | null
          is_member: boolean | null
          leaderboard_opt_out: boolean | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email_notifications?: boolean | null
          event_reminders_enabled?: boolean | null
          full_name?: string | null
          id: string
          in_app_notifications?: boolean | null
          interests?: string[] | null
          is_admin?: boolean | null
          is_approved?: boolean | null
          is_member?: boolean | null
          leaderboard_opt_out?: boolean | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email_notifications?: boolean | null
          event_reminders_enabled?: boolean | null
          full_name?: string | null
          id?: string
          in_app_notifications?: boolean | null
          interests?: string[] | null
          is_admin?: boolean | null
          is_approved?: boolean | null
          is_member?: boolean | null
          leaderboard_opt_out?: boolean | null
          username?: string
        }
        Relationships: []
      }
      recipient_lists: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipient_lists_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_config: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: string | null
          verification_status: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
          verification_status?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
          verification_status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "site_config_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_media_feeds: {
        Row: {
          created_at: string
          display_order: number
          feed_url: string
          id: string
          is_active: boolean | null
          platform: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          feed_url: string
          id?: string
          is_active?: boolean | null
          platform: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          feed_url?: string
          id?: string
          is_active?: boolean | null
          platform?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string | null
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_blocks: {
        Row: {
          blocked_id: string | null
          blocker_id: string | null
          created_at: string
          id: string
        }
        Insert: {
          blocked_id?: string | null
          blocker_id?: string | null
          created_at?: string
          id?: string
        }
        Update: {
          blocked_id?: string | null
          blocker_id?: string | null
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_blocks_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_blocks_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist_notifications: {
        Row: {
          event_id: string | null
          id: string
          is_read: boolean | null
          notification_type: string
          sent_at: string | null
          user_id: string | null
        }
        Insert: {
          event_id?: string | null
          id?: string
          is_read?: boolean | null
          notification_type: string
          sent_at?: string | null
          user_id?: string | null
        }
        Update: {
          event_id?: string | null
          id?: string
          is_read?: boolean | null
          notification_type?: string
          sent_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_notifications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_notifications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      event_public_view: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string | null
          description: string | null
          display_order: number | null
          end_time: string | null
          id: string | null
          image_url: string | null
          imported_rsvp_count: number | null
          is_featured: boolean | null
          location: string | null
          max_guests: number | null
          time: string | null
          title: string | null
          waitlist_capacity: number | null
          waitlist_enabled: boolean | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          description?: string | null
          display_order?: number | null
          end_time?: string | null
          id?: string | null
          image_url?: string | null
          imported_rsvp_count?: number | null
          is_featured?: boolean | null
          location?: string | null
          max_guests?: number | null
          time?: string | null
          title?: string | null
          waitlist_capacity?: number | null
          waitlist_enabled?: boolean | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          description?: string | null
          display_order?: number | null
          end_time?: string | null
          id?: string | null
          image_url?: string | null
          imported_rsvp_count?: number | null
          is_featured?: boolean | null
          location?: string | null
          max_guests?: number | null
          time?: string | null
          title?: string | null
          waitlist_capacity?: number | null
          waitlist_enabled?: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_update_user: {
        Args: {
          admin_id: string
          target_user_id: string
          new_username: string
          new_full_name: string
          new_avatar_url: string
          new_is_admin: boolean
          new_is_approved: boolean
          new_is_member: boolean
        }
        Returns: undefined
      }
      can_message_user: {
        Args: {
          target_user_id: string
        }
        Returns: boolean
      }
      create_profile: {
        Args: {
          user_id: string
          user_username: string
          user_full_name?: string
          user_avatar_url?: string
          user_is_admin?: boolean
        }
        Returns: undefined
      }
      import_wix_event:
        | {
            Args: {
              p_title: string
              p_description: string
              p_date: string
              p_time: string
              p_location: string
              p_max_guests: number
              p_created_by: string
              p_image_url: string
              p_created_at?: string
            }
            Returns: string
          }
        | {
            Args: {
              p_title: string
              p_description: string
              p_date: string
              p_time: string
              p_location: string
              p_max_guests: number
              p_created_by: string
              p_image_url: string
              p_rsvp_count?: number
              p_created_at?: string
            }
            Returns: string
          }
      mark_messages_as_read: {
        Args: {
          p_receiver_id: string
          p_sender_id: string
        }
        Returns: undefined
      }
      search_site: {
        Args: {
          search_term: string
        }
        Returns: {
          type: string
          id: string
          title: string
          description: string
          url: string
          created_at: string
        }[]
      }
      test_email_template: {
        Args: {
          template_name: string
          test_email: string
          test_data?: Json
        }
        Returns: string
      }
      update_leaderboard_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      message_status: "draft" | "scheduled" | "sent" | "failed"
      notification_type: "message" | "event_reminder"
      recipient_type: "individual" | "group" | "all" | "event" | "custom_list"
      rsvp_response: "attending" | "not_attending" | "maybe"
      social_media_platform: "instagram" | "facebook" | "twitter"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

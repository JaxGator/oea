
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
          interests: string[];
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
          interests?: string[];
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
          interests?: string[];
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

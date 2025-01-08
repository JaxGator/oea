export interface WaitlistEntry {
  id: string;
  created_at: string;
  profiles: {
    username: string;
    full_name: string | null;
    email_notifications: boolean;
    user_id: string;
  };
}

export interface WaitlistStats {
  currentRSVPs?: number;
  maxGuests: number;
  waitlistCount: number;
  waitlistCapacity: number | null;
}
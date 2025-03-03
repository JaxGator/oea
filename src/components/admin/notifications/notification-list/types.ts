
export interface AdminNotification {
  id: string;
  type: string;
  message: string;
  metadata: any;
  created_at: string;
  is_read: boolean;
}

// Add additional notification types as needed
export type NotificationType = 'message' | 'event' | 'system' | 'admin';

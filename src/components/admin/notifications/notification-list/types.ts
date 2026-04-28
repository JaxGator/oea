
export interface AdminNotification {
  id: string;
  type: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any;
  created_at: string;
  is_read: boolean;
}

// Add additional notification types as needed
export type NotificationType = 'message' | 'event' | 'system' | 'admin';

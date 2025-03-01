
export interface AdminNotification {
  id: string;
  type: string;
  message: string;
  metadata: any;
  created_at: string;
  is_read: boolean;
}

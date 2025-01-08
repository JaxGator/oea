import { Json } from "./database.types";

export type MessageStatus = 'draft' | 'scheduled' | 'sent' | 'failed';
export type RecipientType = 'individual' | 'group' | 'all' | 'event' | 'custom_list';

export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Communication {
  id: string;
  subject: string;
  content: string;
  sender_id: string | null;
  recipient_type: RecipientType;
  recipient_data: Record<string, any>;
  status: MessageStatus;
  scheduled_for: string | null;
  sent_at: string | null;
  template_id: string | null;
  metadata: Record<string, any> | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface MessageDelivery {
  id: string;
  communication_id: string | null;
  recipient_id: string | null;
  status: MessageStatus;
  delivered_at: string | null;
  opened_at: string | null;
  error_message: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface RecipientList {
  id: string;
  name: string;
  description: string | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ListMember {
  list_id: string;
  member_id: string;
  added_at: string | null;
}
import { Profile } from "@/types/auth";

export interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  is_read: boolean;
  sender: Profile;
  receiver: Profile;
}

export interface ConversationType {
  user: Profile;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
}

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
  group_chat?: {
    id: string;
    name: string;
    description: string | null;
  };
}

export interface GroupMessageRaw {
  id: string;
  content: string;
  created_at: string;
  sender: Profile;
  group_chat_id: string;
}

export interface GroupChatRaw {
  id: string;
  name: string;
  description: string | null;
  messages: {
    id: string;
    content: string;
    created_at: string;
    sender: Profile;
  }[];
  participants: {
    user: Profile;
  }[];
}

export interface GroupMessage {
  id: string;
  content: string;
  created_at: string;
  sender: Profile;
  group_chat: {
    id: string;
    name: string;
    description: string | null;
  };
}

export interface GroupChat {
  id: string;
  name: string;
  description: string | null;
  participants: Profile[];
  messages: GroupMessage[];
  lastMessage: GroupMessage | null;
}

export interface ConversationType {
  user: Profile;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
  isGroup?: boolean;
  groupInfo?: {
    id: string;
    name: string;
    description: string | null;
    participants: Profile[];
  };
}

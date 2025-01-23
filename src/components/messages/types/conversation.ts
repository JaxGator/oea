import { Profile } from "@/types/auth";
import { Message } from "../types";

export interface ConversationType {
  user: Profile;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
}

export interface ConversationListProps {
  conversations: Record<string, ConversationType>;
  selectedConversation: string | null;
  onSelect: (userId: string) => void;
}

export interface ConversationHeaderProps {
  conversation: ConversationType;
  onBack: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export interface ConversationContentProps {
  messages: Message[];
  currentUserId: string;
  onEdit: (messageId: string, content: string) => void;
  onDelete: (messageId: string) => void;
}

export interface ConversationInputProps {
  onSend: (content: string) => Promise<void>;
  isSending: boolean;
}
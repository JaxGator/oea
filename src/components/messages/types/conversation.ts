
import { Profile } from "@/types/auth";
import { Message as MessageType } from "../types";

export type { MessageType as Message };

export interface ConversationType {
  user: Profile;
  messages: MessageType[];
  lastMessage: MessageType;
  unreadCount: number;
  isGroup?: boolean;
  groupInfo?: {
    id: string;
    name: string;
    description: string | null;
    participants: Profile[];
  };
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
  messages: MessageType[];
  currentUserId: string;
  onEdit: (messageId: string, content: string) => void;
  onDelete: (messageId: string) => void;
}

export interface ConversationInputProps {
  onSend: (content: string) => Promise<void>;
  isSending: boolean;
}

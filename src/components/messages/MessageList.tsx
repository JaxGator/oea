import { useNavigate } from "react-router-dom";

type SearchResult = {
  type: string;
  id: string;
  title: string;
  description: string | null;
  url: string;
  created_at: string;
};

interface MessageListProps {
  conversations: Record<string, any>;
  selectedConversation: string | null;
  isSending: boolean;
  onSelect: (userId: string) => void;
  onMessageSend: (content: string) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function MessageList({ 
  conversations,
  selectedConversation,
  isSending,
  onSelect,
  onMessageSend,
  onCancel,
  onDelete
}: MessageListProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {Object.entries(conversations).map(([userId, conversation]) => (
        <button
          key={userId}
          className="w-full text-left p-2 hover:bg-accent rounded-md transition-colors cursor-pointer active:bg-accent/80"
          onClick={() => onSelect(userId)}
          type="button"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{conversation.user.username}</span>
            <span className="text-xs text-muted-foreground capitalize">
              {new Date(conversation.lastMessage.created_at).toLocaleDateString()}
            </span>
          </div>
          {conversation.lastMessage && (
            <span className="text-sm text-muted-foreground line-clamp-1">
              {conversation.lastMessage.content}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
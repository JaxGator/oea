import { Card } from "@/components/ui/card";
import { MessageForm } from "@/components/members/communication/MessageForm";
import { ConversationType } from "./types";
import { ConversationMessage } from "./ConversationMessage";
import { useMessageOperations } from "@/hooks/messages/useMessageOperations";
import { useSession } from "@/hooks/auth/useSession";

interface MessageListProps {
  conversations: Record<string, ConversationType>;
  selectedConversation: string | null;
  isSending: boolean;
  onConversationSelect: (id: string) => void;
  onMessageSend: (content: string) => void;
  onCancel: () => void;
}

export function MessageList({
  conversations,
  selectedConversation,
  isSending,
  onConversationSelect,
  onMessageSend,
  onCancel,
}: MessageListProps) {
  const { user } = useSession();
  const { deleteMessage, editMessage } = useMessageOperations();

  return (
    <div className="space-y-4">
      {Object.values(conversations || {}).map((conversation) => (
        <Card 
          key={conversation.user.id} 
          className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => onConversationSelect(conversation.user.id)}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">
                {conversation.user.username}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(conversation.lastMessage.created_at).toLocaleDateString()}
              </p>
            </div>
            {conversation.unreadCount > 0 && (
              <div className="flex items-center space-x-2">
                <div className="bg-primary w-2 h-2 rounded-full" />
                <span className="text-sm text-muted-foreground">
                  {conversation.unreadCount} unread
                </span>
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            {conversation.messages.map((message) => (
              <ConversationMessage
                key={message.id}
                message={message}
                isCurrentUser={message.sender_id === user?.id}
                onEdit={(messageId, content) => editMessage({ messageId, content })}
                onDelete={deleteMessage}
              />
            ))}
          </div>
          {selectedConversation === conversation.user.id && (
            <MessageForm
              isSending={isSending}
              onSend={onMessageSend}
              onCancel={onCancel}
            />
          )}
        </Card>
      ))}
    </div>
  );
}
import { Card } from "@/components/ui/card";
import { MessageForm } from "@/components/members/communication/MessageForm";
import { ConversationType } from "./types";
import { ConversationMessage } from "./ConversationMessage";
import { useMessageOperations } from "@/hooks/messages/useMessageOperations";
import { useSession } from "@/hooks/auth/useSession";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {Object.values(conversations || {}).map((conversation) => (
        <Card 
          key={conversation.user.id} 
          className={`relative flex flex-col h-[calc(100dvh-12rem)] ${
            selectedConversation === conversation.user.id 
              ? 'ring-2 ring-primary' 
              : 'hover:bg-accent/50 cursor-pointer'
          }`}
          onClick={() => onConversationSelect(conversation.user.id)}
        >
          <div className="sticky top-0 z-10 p-6 border-b bg-background">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {conversation.user.username}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(conversation.lastMessage.created_at), 'MMM d, yyyy')}
                </p>
              </div>
              {conversation.unreadCount > 0 && (
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-2 py-1 rounded-full">
                  <div className="bg-primary w-2 h-2 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">
                    {conversation.unreadCount} unread
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${isMobile ? 'pb-32' : 'pb-6'}`}>
            {conversation.messages.map((message) => (
              <ConversationMessage
                key={message.id}
                message={message}
                isCurrentUser={message.sender_id === user?.id}
                onEdit={(messageId, content) => editMessage({ messageId, content })}
                onDelete={deleteMessage}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {selectedConversation === conversation.user.id && (
            <div className="sticky bottom-0 p-6 bg-background border-t">
              <MessageForm
                isSending={isSending}
                onSend={onMessageSend}
                onCancel={onCancel}
              />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
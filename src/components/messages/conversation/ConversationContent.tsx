
import { ConversationMessage } from "../ConversationMessage";
import { ConversationContentProps } from "../types/conversation";
import { useEffect, useRef } from "react";

export function ConversationContent({ 
  messages, 
  currentUserId,
  onEdit,
  onDelete
}: ConversationContentProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <ConversationMessage
          key={message.id}
          message={message}
          isCurrentUser={message.sender_id === currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

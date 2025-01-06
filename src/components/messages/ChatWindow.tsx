import { useEffect, useRef } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatSkeleton } from "@/components/chat/ChatSkeleton";
import { useMessages } from "@/hooks/useMessages";
import { UnauthorizedMessage } from "@/components/chat/UnauthorizedMessage";

interface ChatWindowProps {
  selectedUserId: string | null;
}

export function ChatWindow({ selectedUserId }: ChatWindowProps) {
  const { user } = useAuthState();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: messages, isLoading, error } = useMessages(selectedUserId);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedUserId) {
    return (
      <div className="h-full flex items-center justify-center p-4 bg-gray-50">
        <p className="text-gray-500">Select a user to start messaging</p>
      </div>
    );
  }

  if (error) {
    return <UnauthorizedMessage />;
  }

  if (isLoading) {
    return <ChatSkeleton />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isOwnMessage={message.sender_id === user?.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput receiverId={selectedUserId} />
    </div>
  );
}
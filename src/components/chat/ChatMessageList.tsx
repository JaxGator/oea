import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatMessage as ChatMessageComponent } from "./ChatMessage";
import { forwardRef } from "react";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender?: {
    username: string;
    avatar_url: string | null;
  };
}

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  currentUserId?: string;
  isAdmin: boolean;
}

export const ChatMessageList = forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ messages, isLoading, currentUserId, isAdmin }, ref) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>No messages yet. Start the conversation!</p>
        </div>
      );
    }

    return (
      <ScrollArea ref={ref} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessageComponent
              key={message.id}
              message={message}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </ScrollArea>
    );
  }
);

ChatMessageList.displayName = "ChatMessageList";
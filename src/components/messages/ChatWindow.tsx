import { useMessages } from "@/hooks/messages/useMessages";
import { useAuthState } from "@/hooks/useAuthState";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChatInput } from "../chat/ChatInput";

interface ChatWindowProps {
  selectedUserId?: string | null;
  groupId?: string | null;
}

export function ChatWindow({ selectedUserId, groupId }: ChatWindowProps) {
  const { user } = useAuthState();
  const { messages, isLoading } = useMessages(user?.id, selectedUserId);

  if (!selectedUserId && !groupId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a conversation to start messaging
      </div>
    );
  }

  // Show group chat interface
  if (groupId) {
    return (
      <div className="flex flex-col h-full">
        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
          userId={user?.id} 
        />
        <ChatInput 
          userId={user?.id} 
          chatId={groupId}
        />
      </div>
    );
  }

  // Show direct message interface
  return (
    <div className="flex flex-col h-full">
      <MessageList 
        messages={messages} 
        isLoading={isLoading} 
        userId={user?.id} 
      />
      <MessageInput 
        userId={user?.id} 
        selectedUserId={selectedUserId} 
      />
    </div>
  );
}
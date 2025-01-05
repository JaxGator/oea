import { useMessages } from "@/hooks/messages/useMessages";
import { useAuthState } from "@/hooks/useAuthState";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

interface ChatWindowProps {
  selectedUserId: string | null;
}

export function ChatWindow({ selectedUserId }: ChatWindowProps) {
  const { user } = useAuthState();
  const { messages, isLoading } = useMessages(user?.id, selectedUserId);

  if (!selectedUserId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a user to start messaging
      </div>
    );
  }

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
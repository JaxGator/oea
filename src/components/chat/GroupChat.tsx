import { useGroupChat } from "./useGroupChat";
import { ChatHeader } from "./ChatHeader";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { ChatSkeleton } from "./ChatSkeleton";
import { UnauthorizedMessage } from "./UnauthorizedMessage";
import { useAuthState } from "@/hooks/useAuthState";

export function GroupChat() {
  const { messages, isLoading, chatTitle, setChatTitle } = useGroupChat();
  const { profile, user } = useAuthState();

  if (!profile?.is_approved) {
    return <UnauthorizedMessage />;
  }

  if (isLoading) {
    return <ChatSkeleton />;
  }

  const isAdmin = profile?.is_admin || false;

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        chatTitle={chatTitle} 
        setChatTitle={setChatTitle} 
        isAdmin={isAdmin}
      />
      <ChatMessageList 
        messages={messages} 
        isLoading={isLoading}
        currentUserId={user?.id}
        isAdmin={isAdmin}
      />
      <ChatInput 
        userId={user?.id} 
        chatId="default" // Using a default chat ID since we're not using multiple chats
      />
    </div>
  );
}
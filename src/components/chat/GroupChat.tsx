import { useGroupChat } from "./useGroupChat";
import { ChatHeader } from "./ChatHeader";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { ChatSkeleton } from "./ChatSkeleton";
import { UnauthorizedMessage } from "./UnauthorizedMessage";
import { useAuthState } from "@/hooks/useAuthState";

export function GroupChat() {
  const { messages, isLoading, chatTitle } = useGroupChat();
  const { profile } = useAuthState();

  if (!profile?.is_approved) {
    return <UnauthorizedMessage />;
  }

  if (isLoading) {
    return <ChatSkeleton />;
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader title={chatTitle} />
      <ChatMessageList messages={messages} />
      <ChatInput />
    </div>
  );
}
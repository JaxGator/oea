import { useRef } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatSkeleton } from "./ChatSkeleton";
import { UnauthorizedMessage } from "./UnauthorizedMessage";
import { ChatMessageList } from "./ChatMessageList";
import { ChatContainer } from "./ChatContainer";
import { useGroupChat } from "./useGroupChat";

export function GroupChat() {
  const { user, profile, isLoading: isAuthLoading } = useAuthState();
  const { messages, isLoading, chatTitle, setChatTitle } = useGroupChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  // Show loading state while checking auth
  if (isAuthLoading) {
    return <ChatSkeleton />;
  }

  // Check for approval status after loading is complete
  if (!profile?.is_approved && !profile?.is_admin) {
    return <UnauthorizedMessage />;
  }

  return (
    <ChatContainer>
      <ChatHeader 
        chatTitle={chatTitle}
        setChatTitle={setChatTitle}
        isAdmin={profile?.is_admin || false}
      />
      
      <ChatMessageList
        ref={scrollRef}
        messages={messages}
        isLoading={isLoading}
        currentUserId={user?.id}
        isAdmin={profile?.is_admin || false}
      />

      <ChatInput userId={user?.id} />
    </ChatContainer>
  );
}
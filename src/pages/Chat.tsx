import { useSession } from "@/hooks/auth/useSession";
import { useProfile } from "@/hooks/auth/useProfile";
import { MessageList } from "@/components/members/MessageList";
import { MessageInput } from "@/components/members/MessageInput";
import { useChat } from "@/hooks/useChat";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Chat() {
  const { user } = useSession();
  const { profile, isLoading } = useProfile(user?.id);
  const { messages, newMessage, setNewMessage, handleSendMessage } = useChat();

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!profile?.is_approved && !profile?.is_admin) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You need to be an approved member to access the group chat.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Group Chat</h1>
      </div>
      <MessageList messages={messages} currentUserId={user?.id || ''} />
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSubmit={handleSendMessage}
      />
    </div>
  );
}
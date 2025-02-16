
import { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { StreamChatProvider } from "@/components/messages/StreamChatProvider";
import { Channel, ChannelList, MessageList, MessageInput, Thread, Window } from 'stream-chat-react';
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

function MessagesPage() {
  const { user, isLoading } = useAuthState();
  const navigate = useNavigate();
  const [activeChannel, setActiveChannel] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <StreamChatProvider>
      <div className="h-[calc(100vh-4rem)] bg-background">
        <div className="container mx-auto h-full max-w-7xl p-4">
          <div className="grid h-full gap-4 md:grid-cols-[280px,1fr]">
            <div className="hidden md:block border rounded-lg overflow-hidden bg-card">
              <ChannelList
                filters={{
                  members: { $in: [user.id] },
                  type: 'messaging'
                }}
                sort={{ last_message_at: -1 }}
                onSelect={(channel) => setActiveChannel(channel?.id || '')}
              />
            </div>
            <div className="border rounded-lg overflow-hidden bg-card">
              <Channel>
                <Window>
                  <MessageList />
                  <MessageInput focus />
                </Window>
                <Thread />
              </Channel>
            </div>
          </div>
        </div>
      </div>
    </StreamChatProvider>
  );
}

export default MessagesPage;

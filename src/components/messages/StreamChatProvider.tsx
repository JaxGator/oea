
import { useEffect, PropsWithChildren, useState } from 'react';
import { Chat, LoadingIndicator } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import { getStreamChat } from '@/integrations/stream/client';
import { useAuthState } from '@/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import 'stream-chat-react/dist/css/v2/index.css';

export function StreamChatProvider({ children }: PropsWithChildren) {
  const { user } = useAuthState();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    let unmounted = false;

    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // Get Stream client instance
        const client = await getStreamChat();
        
        if (unmounted) return;

        // Get user token from our backend
        const { data: streamResponse, error: streamError } = await supabase.functions
          .invoke('upsert-stream-user', {
            body: { 
              user: {
                id: user.id,
                name: user.username || user.id,
                image: user.avatar_url,
              }
            }
          });

        if (streamError || !streamResponse?.result?.token) {
          throw new Error(streamError?.message || 'Failed to get Stream token');
        }

        // Connect user to Stream
        await client.connectUser(
          {
            id: user.id,
            name: user.username || user.id,
            image: user.avatar_url,
          },
          streamResponse.result.token
        );

        // Watch for connection changes
        client.on('connection.changed', (event) => {
          console.log('Connection changed:', event);
        });

        client.on('connection.recovered', () => {
          console.log('Connection recovered');
        });

        if (!unmounted) {
          setChatClient(client);
          console.log('Stream Chat initialized successfully');
        }
      } catch (error) {
        console.error('Stream Chat initialization error:', error);
        if (!unmounted) {
          toast({
            title: "Chat Error",
            description: "Failed to initialize chat. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        if (!unmounted) {
          setIsLoading(false);
        }
      }
    };

    initializeChat();

    return () => {
      unmounted = true;
      if (chatClient) {
        chatClient.disconnectUser().then(() => {
          console.log('User disconnected from Stream');
        });
      }
    };
  }, [user, toast]);

  if (!user) return null;

  if (isLoading || !chatClient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Chat client={chatClient} theme="str-chat__theme-light">
      {children}
    </Chat>
  );
}

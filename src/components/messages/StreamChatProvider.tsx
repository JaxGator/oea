
import { useEffect, PropsWithChildren, useState, useRef } from 'react';
import { Chat } from 'stream-chat-react';
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
  const chatClientRef = useRef<StreamChat | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    let unmounted = false;

    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        const client = await getStreamChat();

        if (unmounted) return;

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

        if (streamError) {
          console.error('Stream token error:', streamError);
          throw streamError;
        }

        if (!streamResponse?.result?.token) {
          console.error('No token in response:', streamResponse);
          throw new Error('Failed to get Stream token');
        }

        await client.connectUser(
          {
            id: user.id,
            name: user.username || user.id,
            image: user.avatar_url,
          },
          streamResponse.result.token
        );

        if (!unmounted) {
          chatClientRef.current = client;
          setChatClient(client);
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
      if (chatClientRef.current) {
        chatClientRef.current.disconnectUser().catch(console.error);
        chatClientRef.current = null;
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

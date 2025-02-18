
import { useEffect, PropsWithChildren, useState } from 'react';
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

  useEffect(() => {
    if (!user?.id) return;

    let unmounted = false;

    const initializeStreamChat = async () => {
      try {
        setIsLoading(true);
        const streamChatClient = await getStreamChat();
        
        if (unmounted) return;
        
        console.log('Initializing Stream Chat for user:', user.id);
        
        // Call the upsert-stream-user function to get a token
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
          console.error('Error upserting Stream user:', streamError);
          throw streamError;
        }

        if (!streamResponse?.result?.token) {
          throw new Error('No token received from Stream');
        }

        console.log('Received Stream token, connecting user...');

        try {
          // Connect user to Stream Chat with the received token
          await streamChatClient.connectUser(
            {
              id: user.id,
              name: user.username || user.id,
              image: user.avatar_url || undefined,
            },
            streamResponse.result.token
          );
          
          if (!unmounted) {
            setChatClient(streamChatClient);
            console.log('Stream Chat initialized successfully');
          }
        } catch (connectionError) {
          console.error('Error connecting user:', connectionError);
          // If there's a connection error, try disconnecting first then reconnecting
          await streamChatClient.disconnectUser();
          throw connectionError;
        }
      } catch (error) {
        console.error('Error initializing Stream Chat:', error);
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

    initializeStreamChat();

    return () => {
      unmounted = true;
      // Cleanup function
      if (chatClient) {
        chatClient.disconnectUser();
        setChatClient(null);
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
    <Chat client={chatClient}>
      {children}
    </Chat>
  );
}

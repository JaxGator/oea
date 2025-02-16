
import { useEffect, PropsWithChildren } from 'react';
import { Chat } from 'stream-chat-react';
import { streamChat } from '@/integrations/stream/client';
import { useAuthState } from '@/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import 'stream-chat-react/dist/css/v2/index.css';

export function StreamChatProvider({ children }: PropsWithChildren) {
  const { user } = useAuthState();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) return;

    const initializeStreamChat = async () => {
      try {
        console.log('Fetching Stream token for user:', user.id);
        
        // Get or create Stream Chat token
        const { data: streamData, error: streamError } = await supabase
          .from('stream_chat_users')
          .select('stream_chat_token')
          .eq('id', user.id)
          .maybeSingle();

        if (streamError) {
          console.error('Error fetching Stream token:', streamError);
          throw streamError;
        }

        let streamToken = streamData?.stream_chat_token;
        console.log('Existing token found:', !!streamToken);

        if (!streamToken) {
          console.log('No token found, generating new one...');
          // Call edge function to generate token
          const { data: tokenData, error: tokenError } = await supabase.functions.invoke('generate-stream-token', {
            body: { userId: user.id }
          });

          if (tokenError) {
            console.error('Error generating token:', tokenError);
            throw tokenError;
          }
          
          streamToken = tokenData.token;
          console.log('New token generated successfully');

          // Store the token
          const { error: upsertError } = await supabase
            .from('stream_chat_users')
            .upsert({ id: user.id, stream_chat_token: streamToken });

          if (upsertError) {
            console.error('Error storing token:', upsertError);
            throw upsertError;
          }
          
          console.log('Token stored successfully');
        }

        // Disconnect first to ensure clean state
        await streamChat.disconnectUser();

        // Connect user to Stream Chat
        await streamChat.connectUser(
          {
            id: user.id,
            name: user.username || user.id,
            image: user.avatar_url || undefined,
          },
          streamToken
        );

        console.log('Stream Chat initialized successfully for user:', user.id);
      } catch (error) {
        console.error('Error initializing Stream Chat:', error);
        toast({
          title: "Chat Error",
          description: "Failed to initialize chat. Please try again.",
          variant: "destructive",
        });
      }
    };

    initializeStreamChat();

    return () => {
      streamChat.disconnectUser();
    };
  }, [user, toast]);

  if (!user) return null;

  return (
    <Chat client={streamChat}>
      {children}
    </Chat>
  );
}

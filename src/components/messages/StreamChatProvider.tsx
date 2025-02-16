
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
        // Get or create Stream Chat token
        const { data: streamData, error: streamError } = await supabase
          .from('stream_chat_users')
          .select('stream_chat_token')
          .eq('id', user.id)
          .single();

        if (streamError && !streamError.message.includes('No rows found')) {
          throw streamError;
        }

        let streamToken = streamData?.stream_chat_token;

        if (!streamToken) {
          // Call edge function to generate token
          const { data: tokenData, error: tokenError } = await supabase.functions.invoke('generate-stream-token', {
            body: { userId: user.id }
          });

          if (tokenError) throw tokenError;
          streamToken = tokenData.token;

          // Store the token
          await supabase
            .from('stream_chat_users')
            .upsert({ id: user.id, stream_chat_token: streamToken });
        }

        // Connect user to Stream Chat
        await streamChat.connectUser(
          {
            id: user.id,
            name: user.username || user.id,
            image: user.avatar_url || undefined,
          },
          streamToken
        );

        console.log('Stream Chat initialized for user:', user.id);
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
    <Chat client={streamChat} theme="str-chat__theme-light">
      {children}
    </Chat>
  );
}

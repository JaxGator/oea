
import { StreamChat } from 'stream-chat';
import { supabase } from '@/integrations/supabase/client';

let streamChat: StreamChat | null = null;

// Function to get or initialize the Stream Chat client
export async function getStreamChat() {
  if (!streamChat) {
    const { data: { value: apiKey }, error } = await supabase
      .functions.invoke('get-stream-key');

    if (error || !apiKey) {
      console.error('Error fetching Stream API key:', error);
      throw new Error('Failed to fetch Stream API key');
    }

    streamChat = new StreamChat(apiKey);
  }
  return streamChat;
}

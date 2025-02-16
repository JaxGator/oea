
import { StreamChat } from 'stream-chat';
import { supabase } from '@/integrations/supabase/client';

// Create a function to initialize the Stream Chat client
async function initializeStreamChat() {
  try {
    const { data: { value: apiKey }, error } = await supabase
      .functions.invoke('get-stream-key');

    if (error || !apiKey) {
      console.error('Error fetching Stream API key:', error);
      throw new Error('Failed to fetch Stream API key');
    }

    return new StreamChat(apiKey);
  } catch (error) {
    console.error('Error initializing Stream Chat:', error);
    throw error;
  }
}

// Export a singleton instance that will be initialized
export let streamChat: StreamChat;

// Function to get or initialize the Stream Chat client
export async function getStreamChat() {
  if (!streamChat) {
    streamChat = await initializeStreamChat();
  }
  return streamChat;
}

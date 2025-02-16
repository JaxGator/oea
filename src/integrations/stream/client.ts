
import { StreamChat } from 'stream-chat';

// Initialize Stream Chat client
export const streamChat = new StreamChat(
  import.meta.env.VITE_STREAM_API_KEY || ''
);

if (!import.meta.env.VITE_STREAM_API_KEY) {
  console.error('Stream API key is not set');
}

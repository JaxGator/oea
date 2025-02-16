
import { StreamChat } from 'stream-chat';

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

if (!apiKey) {
  console.error('Stream API key is not set in environment variables');
  throw new Error('Stream API key is required');
}

// Initialize Stream Chat client
export const streamChat = new StreamChat(apiKey);

console.log('Stream Chat client initialized with API key');

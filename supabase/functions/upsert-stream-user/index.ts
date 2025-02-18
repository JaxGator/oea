
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts";
import { StreamChat } from "https://esm.sh/stream-chat@8.14.1";

const STREAM_API_KEY = Deno.env.get('STREAM_API_KEY') ?? '';
const STREAM_API_SECRET = Deno.env.get('STREAM_API_SECRET') ?? '';

async function upsertStreamUser(user: { id: string; name?: string; image?: string }) {
  if (!STREAM_API_KEY || !STREAM_API_SECRET) {
    throw new Error('Stream API credentials not configured');
  }

  console.log('Creating/updating Stream user:', {
    userId: user.id,
    hasName: !!user.name,
    hasImage: !!user.image
  });

  const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

  try {
    // Create or update the user
    await serverClient.upsertUser({
      id: user.id,
      name: user.name || user.id,
      image: user.image,
    });

    // Generate a token for the user
    const token = serverClient.createToken(user.id);

    return { token };
  } catch (error) {
    console.error('Stream operation failed:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user } = await req.json();

    if (!user?.id) {
      throw new Error('User ID is required');
    }

    const result = await upsertStreamUser(user);
    
    return new Response(
      JSON.stringify({ result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in upsert-stream-user:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

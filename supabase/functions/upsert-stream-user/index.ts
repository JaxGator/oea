
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts";
import { StreamChat } from "https://esm.sh/stream-chat@8.14.1";

const STREAM_API_KEY = Deno.env.get('STREAM_API_KEY') ?? '';
const STREAM_API_SECRET = Deno.env.get('STREAM_API_SECRET') ?? '';

async function upsertStreamUser(user: { id: string; name?: string; image?: string }) {
  console.log('Attempting to upsert user:', { 
    userId: user.id,
    hasName: !!user.name,
    hasImage: !!user.image,
    hasApiKey: !!STREAM_API_KEY,
    hasApiSecret: !!STREAM_API_SECRET 
  });

  try {
    // Initialize the Stream server client
    const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);
    
    // Upsert the user
    await serverClient.upsertUser({
      id: user.id,
      role: 'user',
      name: user.name || user.id,
      image: user.image
    });

    // Generate a user token
    const token = serverClient.createToken(user.id);

    console.log('Successfully created/updated Stream user:', {
      userId: user.id,
      hasToken: !!token
    });

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
    console.log('Received request with user data:', { 
      userId: user?.id,
      hasName: !!user?.name,
      hasImage: !!user?.image 
    });

    if (!user || !user.id) {
      throw new Error('User data is required');
    }

    if (!STREAM_API_KEY || !STREAM_API_SECRET) {
      console.error('Missing Stream API credentials');
      throw new Error('Stream API credentials are not configured');
    }

    const result = await upsertStreamUser(user);
    
    return new Response(
      JSON.stringify({ 
        message: 'User created and token generated successfully', 
        result 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in upsert-stream-user:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Failed to create/update user in Stream'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

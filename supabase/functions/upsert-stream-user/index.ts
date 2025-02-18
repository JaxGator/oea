
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts";
import { StreamChat } from "https://esm.sh/stream-chat@8.14.1";

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const STREAM_API_KEY = Deno.env.get('STREAM_API_KEY');
    const STREAM_API_SECRET = Deno.env.get('STREAM_API_SECRET');

    console.log('Environment check:', {
      hasApiKey: !!STREAM_API_KEY,
      hasApiSecret: !!STREAM_API_SECRET,
      timestamp: new Date().toISOString()
    });

    if (!STREAM_API_KEY || !STREAM_API_SECRET) {
      throw new Error('Stream API credentials are not configured');
    }

    const requestBody = await req.json();
    console.log('Request body:', requestBody);

    const { user } = requestBody;

    if (!user?.id) {
      console.error('Invalid user data:', user);
      throw new Error('Valid user ID is required');
    }

    const serverClient = new StreamChat(STREAM_API_KEY, STREAM_API_SECRET);
    console.log('Stream client initialized');

    // Create or update the user
    await serverClient.upsertUser({
      id: user.id,
      name: user.name || user.id,
      image: user.image,
    });

    // Generate user token
    const token = serverClient.createToken(user.id);

    if (!token) {
      throw new Error('Failed to generate user token');
    }

    console.log('Operation successful:', {
      userId: user.id,
      hasToken: !!token
    });

    return new Response(
      JSON.stringify({
        result: { token }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in upsert-stream-user:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: 'Failed to create/update user in Stream',
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

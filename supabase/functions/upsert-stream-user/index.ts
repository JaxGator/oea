
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts";
// Use a more stable version of the Stream Chat client
import { StreamChat } from "https://esm.sh/stream-chat@8.4.1";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const STREAM_API_KEY = Deno.env.get('STREAM_API_KEY');
    const STREAM_API_SECRET = Deno.env.get('STREAM_API_SECRET');

    // Enhanced environment debugging

    if (!STREAM_API_KEY || !STREAM_API_SECRET) {
      throw new Error('Stream API credentials missing');
    }

    const requestBody = await req.json();
    const { user } = requestBody;

    if (!user?.id) {
      throw new Error('Valid user ID is required');
    }

    // Initialize client differently
    const serverClient = StreamChat.getInstance(STREAM_API_KEY);
    serverClient.secret = STREAM_API_SECRET;


    // First try to generate token
    const token = serverClient.createUserToken(user.id);

    if (!token) {
      throw new Error('Failed to generate token');
    }


    // Then try to upsert user
    const userData = {
      id: user.id,
      name: user.name || user.id,
      image: user.image,
    };

    try {
      await serverClient.upsertUsers([userData]);
    } catch (upsertError) {
      // Log but don't fail - token generation is what matters most
    }

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

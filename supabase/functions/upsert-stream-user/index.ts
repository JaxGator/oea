
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts";
import { StreamChat } from "https://esm.sh/stream-chat@8.14.1";

serve(async (req) => {
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

    const { user } = await req.json();

    if (!user?.id) {
      throw new Error('User ID is required');
    }

    console.log('Creating Stream client for user:', {
      userId: user.id,
      hasName: !!user.name,
      hasImage: !!user.image,
      timestamp: new Date().toISOString()
    });

    try {
      // Initialize Stream Chat client with explicit new instance
      const serverClient = new StreamChat(STREAM_API_KEY, STREAM_API_SECRET);

      // First update user
      const updateResponse = await serverClient.upsertUsers([{
        id: user.id,
        name: user.name || user.id,
        image: user.image,
      }]);

      console.log('User update response:', {
        updateResponse,
        timestamp: new Date().toISOString()
      });

      // Then generate token with explicit user id
      const token = serverClient.createToken(user.id);

      console.log('User upserted and token generated:', {
        userId: user.id,
        hasToken: !!token,
        timestamp: new Date().toISOString()
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
    } catch (streamError) {
      console.error('Stream operation failed:', {
        error: streamError.message,
        stack: streamError.stack,
        timestamp: new Date().toISOString()
      });
      throw streamError;
    }
  } catch (error) {
    console.error('Error in upsert-stream-user:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: 'Failed to create/update user in Stream'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

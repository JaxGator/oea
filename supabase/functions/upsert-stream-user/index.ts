
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts";
import { connect } from "https://esm.sh/getstream@8.1.5";

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

    // Initialize client using Stream's server-side SDK
    const client = connect(STREAM_API_KEY, STREAM_API_SECRET);
    const userClient = client.feed('user', user.id);

    try {
      // Create token using the server-side client
      const token = client.createUserToken(user.id);

      console.log('Token generated:', {
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
        timestamp: new Date().toISOString()
      });
      throw streamError;
    }
  } catch (error) {
    console.error('Error in upsert-stream-user:', {
      error: error.message,
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


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

    // Parse request body and log it for debugging
    const requestBody = await req.json();
    console.log('Request body:', {
      body: requestBody,
      timestamp: new Date().toISOString()
    });

    const { user } = requestBody;

    if (!user?.id) {
      console.error('Invalid user data:', {
        user,
        timestamp: new Date().toISOString()
      });
      throw new Error('Valid user ID is required');
    }

    console.log('Processing request for user:', {
      userId: user.id,
      name: user.name,
      hasImage: !!user.image,
      timestamp: new Date().toISOString()
    });

    try {
      // Initialize Stream Chat client
      const serverClient = new StreamChat(STREAM_API_KEY, STREAM_API_SECRET);
      console.log('Stream client initialized');

      // Update user
      const userData = {
        id: user.id,
        name: user.name || user.id,
        image: user.image,
      };

      console.log('Upserting user:', {
        userData,
        timestamp: new Date().toISOString()
      });

      await serverClient.upsertUsers([userData]);

      // Generate token
      const token = serverClient.createToken(user.id);

      if (!token) {
        throw new Error('Failed to generate user token');
      }

      console.log('Operation successful:', {
        userId: user.id,
        hasToken: true,
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

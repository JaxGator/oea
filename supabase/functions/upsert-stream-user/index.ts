
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts";
import { StreamChat } from "https://esm.sh/v135/stream-chat@8.14.1";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const STREAM_API_KEY = Deno.env.get('STREAM_API_KEY');
    const STREAM_API_SECRET = Deno.env.get('STREAM_API_SECRET');

    // Log environment status (without exposing actual keys)
    console.log('Environment check:', {
      hasApiKey: !!STREAM_API_KEY,
      hasApiSecret: !!STREAM_API_SECRET,
      timestamp: new Date().toISOString()
    });

    // Validate credentials
    if (!STREAM_API_KEY || !STREAM_API_SECRET) {
      throw new Error('Stream API credentials are not configured');
    }

    const { user } = await req.json();

    // Validate user data
    if (!user?.id) {
      throw new Error('User ID is required');
    }

    console.log('Creating Stream client with user:', {
      userId: user.id,
      hasName: !!user.name,
      hasImage: !!user.image,
      timestamp: new Date().toISOString()
    });

    try {
      // Initialize Stream client with specific version
      const serverClient = new StreamChat(STREAM_API_KEY, STREAM_API_SECRET);

      // Create or update the user
      await serverClient.upsertUser({
        id: user.id,
        name: user.name || user.id,
        image: user.image,
      });

      console.log('User upserted successfully:', {
        userId: user.id,
        timestamp: new Date().toISOString()
      });

      // Generate user token
      const token = serverClient.createToken(user.id);

      console.log('Token generated successfully for user:', {
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

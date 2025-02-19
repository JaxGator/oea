
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts";
// Import a specific version that's known to work with Deno
import { StreamChat } from "https://esm.sh/v135/stream-chat@8.14.1";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const STREAM_API_KEY = Deno.env.get('STREAM_API_KEY');
    const STREAM_API_SECRET = Deno.env.get('STREAM_API_SECRET');

    // Enhanced environment debugging
    console.log('Environment variables:', {
      apiKeyLength: STREAM_API_KEY?.length,
      secretLength: STREAM_API_SECRET?.length,
      apiKeyPrefix: STREAM_API_KEY?.substring(0, 4),
      secretPrefix: STREAM_API_SECRET?.substring(0, 4),
      timestamp: new Date().toISOString()
    });

    if (!STREAM_API_KEY || !STREAM_API_SECRET) {
      throw new Error(`Stream API credentials missing: ${!STREAM_API_KEY ? 'API_KEY' : ''} ${!STREAM_API_SECRET ? 'API_SECRET' : ''}`);
    }

    const requestBody = await req.json();
    const { user } = requestBody;

    if (!user?.id) {
      throw new Error('Valid user ID is required');
    }

    // Create a new instance without using getInstance
    const serverClient = new StreamChat(STREAM_API_KEY);
    serverClient.secret = STREAM_API_SECRET;

    console.log('StreamChat Client validation:', {
      initialized: !!serverClient,
      hasSecret: !!serverClient.secret,
      hasSecretMethod: typeof serverClient?.createToken === 'function',
      hasUpsertMethod: typeof serverClient?.upsertUser === 'function',
      timestamp: new Date().toISOString()
    });

    // Generate user token
    const token = serverClient.createToken(user.id);

    if (!token) {
      throw new Error('Failed to generate token');
    }

    console.log('Token generated:', {
      userId: user.id,
      hasToken: !!token,
      timestamp: new Date().toISOString()
    });

    // Try to upsert the user, but don't fail if it doesn't work
    try {
      await serverClient.upsertUser({
        id: user.id,
        name: user.name || user.id,
        image: user.image,
      });

      console.log('User upserted successfully');
    } catch (upsertError) {
      // Log but don't fail - token generation is what matters most
      console.warn('User upsert failed (non-critical):', upsertError);
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
      timestamp: new Date().toISOString(),
      type: error.constructor.name
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

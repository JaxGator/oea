
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

    // Direct instantiation instead of getInstance
    const serverClient = new StreamChat(STREAM_API_KEY, STREAM_API_SECRET);
    
    console.log('StreamChat Client validation:', {
      initialized: !!serverClient,
      hasSecretMethod: typeof serverClient?.createToken === 'function',
      hasUpsertMethod: typeof serverClient?.upsertUser === 'function',
      timestamp: new Date().toISOString()
    });

    if (!serverClient?.createToken) {
      throw new Error('StreamChat client methods not available');
    }

    // Test token generation before user upsert
    const testToken = serverClient.createToken(user.id);
    console.log('Test token generation:', {
      success: !!testToken,
      tokenLength: testToken?.length,
      timestamp: new Date().toISOString()
    });

    // Only proceed with upsert if token generation worked
    if (testToken) {
      try {
        await serverClient.upsertUser({
          id: user.id,
          name: user.name || user.id,
          image: user.image,
        });

        console.log('User upserted successfully:', {
          userId: user.id,
          timestamp: new Date().toISOString()
        });
      } catch (upsertError) {
        console.warn('User upsert failed, but token was generated:', {
          error: upsertError.message,
          timestamp: new Date().toISOString()
        });
        // Continue since we have a valid token
      }

      return new Response(
        JSON.stringify({
          result: { token: testToken }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      throw new Error('Token generation failed');
    }
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

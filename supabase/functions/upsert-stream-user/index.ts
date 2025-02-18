
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { StreamChat } from "https://esm.sh/stream-chat@8.14.1"
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user } = await req.json()

    if (!user || !user.id) {
      throw new Error('User data is required')
    }

    const streamApiKey = Deno.env.get('STREAM_API_KEY');
    const streamApiSecret = Deno.env.get('STREAM_API_SECRET');

    if (!streamApiKey || !streamApiSecret) {
      throw new Error('Stream API credentials are not configured');
    }

    console.log('Initializing Stream Chat with API key:', streamApiKey);

    // Initialize Stream Chat with server-side API key and secret
    const serverClient = StreamChat.getInstance(streamApiKey, streamApiSecret);

    // Upsert the user
    await serverClient.upsertUser({
      id: user.id,
      name: user.name || user.id,
      image: user.image,
    });

    console.log('Successfully created/updated user:', user.id);

    return new Response(
      JSON.stringify({ message: 'User created successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in upsert-stream-user:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check if Stream API credentials are properly configured'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

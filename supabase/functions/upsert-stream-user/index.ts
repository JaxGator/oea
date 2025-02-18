
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { StreamChat } from 'stream-chat';
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

    // Initialize Stream Chat with server-side API key and secret
    const serverClient = StreamChat.getInstance(
      Deno.env.get('STREAM_API_KEY') ?? '',
      Deno.env.get('STREAM_API_SECRET') ?? ''
    );

    // Upsert the user
    await serverClient.upsertUser({
      id: user.id,
      name: user.name || user.id,
      image: user.image,
    });

    return new Response(
      JSON.stringify({ message: 'User created successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

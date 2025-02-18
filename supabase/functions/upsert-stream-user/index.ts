
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts";

const STREAM_API_KEY = Deno.env.get('STREAM_API_KEY') ?? '';
const STREAM_API_SECRET = Deno.env.get('STREAM_API_SECRET') ?? '';

// Initialize the Stream client using fetch for server-side operations
async function upsertStreamUser(user: { id: string; name?: string; image?: string }) {
  const response = await fetch('https://chat.stream-io-api.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(`${STREAM_API_KEY}:${STREAM_API_SECRET}`)}`,
      'Stream-Auth-Type': 'jwt'
    },
    body: JSON.stringify({
      id: user.id,
      name: user.name || user.id,
      image: user.image
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Stream API error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

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

    console.log('Attempting to create/update user:', user.id);

    const result = await upsertStreamUser(user);
    console.log('Successfully created/updated user:', user.id);

    return new Response(
      JSON.stringify({ message: 'User created successfully', result }),
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
        details: 'Failed to create/update user in Stream'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

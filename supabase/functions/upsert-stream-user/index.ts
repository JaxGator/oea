
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { corsHeaders } from "../_shared/cors.ts";

const STREAM_API_KEY = Deno.env.get('STREAM_API_KEY') ?? '';
const STREAM_API_SECRET = Deno.env.get('STREAM_API_SECRET') ?? '';

function encodeBase64(str: string): string {
  return base64Encode(new TextEncoder().encode(str));
}

// Initialize the Stream client using fetch for server-side operations
async function upsertStreamUser(user: { id: string; name?: string; image?: string }) {
  console.log('Using Stream API key:', STREAM_API_KEY);
  
  const response = await fetch('https://chat.stream-io-api.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${encodeBase64(`${STREAM_API_KEY}:${STREAM_API_SECRET}`)}`,
      'Stream-Auth-Type': 'jwt'
    },
    body: JSON.stringify({
      id: user.id,
      name: user.name || user.id,
      image: user.image
    })
  });

  const responseData = await response.json();

  if (!response.ok) {
    console.error('Stream API error:', responseData);
    throw new Error(`Stream API error: ${JSON.stringify(responseData)}`);
  }

  return responseData;
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

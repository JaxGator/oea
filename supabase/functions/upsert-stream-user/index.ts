
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { corsHeaders } from "../_shared/cors.ts";

const STREAM_API_KEY = Deno.env.get('STREAM_API_KEY') ?? '';
const STREAM_API_SECRET = Deno.env.get('STREAM_API_SECRET') ?? '';

// Initialize the Stream client using fetch for server-side operations
async function upsertStreamUser(user: { id: string; name?: string; image?: string }) {
  console.log('Attempting to upsert user:', { 
    userId: user.id,
    hasName: !!user.name,
    hasImage: !!user.image,
    hasApiKey: !!STREAM_API_KEY,
    hasApiSecret: !!STREAM_API_SECRET 
  });

  const credentials = base64Encode(
    new TextEncoder().encode(`${STREAM_API_KEY}:${STREAM_API_SECRET}`)
  );

  const response = await fetch('https://chat.stream-io-api.com/v2.0/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
      'Stream-Auth-Type': 'basic',
    },
    body: JSON.stringify({
      id: user.id,
      role: 'user',
      name: user.name || user.id,
      image: user.image
    })
  });

  const responseData = await response.json();
  console.log('Stream API Response:', {
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    data: responseData
  });

  if (!response.ok) {
    console.error('Stream API Error Details:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData,
      url: response.url,
      headers: Object.fromEntries(response.headers.entries())
    });
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
    const { user } = await req.json();
    console.log('Received request with user data:', { 
      userId: user?.id,
      hasName: !!user?.name,
      hasImage: !!user?.image 
    });

    if (!user || !user.id) {
      throw new Error('User data is required');
    }

    if (!STREAM_API_KEY || !STREAM_API_SECRET) {
      console.error('Missing Stream API credentials');
      throw new Error('Stream API credentials are not configured');
    }

    const result = await upsertStreamUser(user);
    console.log('Successfully created/updated user:', user.id);

    return new Response(
      JSON.stringify({ 
        message: 'User created successfully', 
        result 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
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
      }
    );
  }
});

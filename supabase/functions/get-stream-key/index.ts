
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    const streamApiKey = Deno.env.get('VITE_STREAM_API_KEY');
    
    if (!streamApiKey) {
      throw new Error('Stream API key not configured');
    }

    return new Response(
      JSON.stringify({ value: streamApiKey }),
      { 
        headers: corsHeaders,
        status: 200 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: corsHeaders,
        status: 500 
      }
    );
  }
});

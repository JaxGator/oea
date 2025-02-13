
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS'
};

console.log("Initializing get-mapbox-token function...");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({
        error: 'Method not allowed',
        success: false
      }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  try {
    const token = Deno.env.get('MAPBOX_PUBLIC_TOKEN');
    console.log('Retrieved token status:', token ? 'found' : 'not found');
    
    if (!token) {
      console.error('MAPBOX_PUBLIC_TOKEN not found in environment');
      return new Response(
        JSON.stringify({
          error: 'Mapbox token not configured',
          success: false
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        token,
        success: true
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        }
      }
    );
  } catch (error) {
    console.error('Error in get-mapbox-token:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});


import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

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
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: corsHeaders
      }
    );
  }

  try {
    console.log('Retrieving Mapbox token...');
    const token = Deno.env.get('MAPBOX_PUBLIC_TOKEN');
    
    if (!token) {
      console.error('MAPBOX_PUBLIC_TOKEN environment variable is not set');
      return new Response(
        JSON.stringify({ 
          error: 'Mapbox token is not configured',
          success: false 
        }),
        {
          status: 500,
          headers: corsHeaders
        }
      );
    }

    console.log('Successfully retrieved Mapbox token');
    return new Response(
      JSON.stringify({ 
        token,
        success: true 
      }),
      {
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (error) {
    console.error('Error retrieving Mapbox token:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        success: false 
      }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
});


import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

console.log('Edge function initialized');

serve(async (req) => {
  console.log(`Received ${req.method} request`);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Accept both GET and POST for flexibility
  if (req.method !== 'GET' && req.method !== 'POST') {
    console.log(`Method ${req.method} not allowed`);
    return new Response(
      JSON.stringify({ 
        error: 'Method not allowed',
        allowed: ['GET', 'POST']
      }),
      {
        status: 405,
        headers: corsHeaders
      }
    );
  }

  try {
    console.log('Attempting to retrieve Mapbox token');
    const token = Deno.env.get('MAPBOX_PUBLIC_TOKEN');
    
    if (!token) {
      console.error('MAPBOX_PUBLIC_TOKEN not found in environment variables');
      return new Response(
        JSON.stringify({ 
          error: 'Mapbox token not configured',
          success: false,
          message: 'Please ensure MAPBOX_PUBLIC_TOKEN is set in Edge Function secrets'
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
    console.error('Error in edge function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        success: false,
        details: error.message
      }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
});

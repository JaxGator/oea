
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    const token = Deno.env.get('MAPBOX_PUBLIC_TOKEN')
    console.log('Attempting to retrieve Mapbox token:', {
      hasToken: !!token,
      method: req.method,
      url: req.url
    })
    
    if (!token) {
      console.error('MAPBOX_PUBLIC_TOKEN environment variable is not set')
      return new Response(
        JSON.stringify({ 
          error: 'Configuration error',
          details: 'Mapbox token not configured. Please add MAPBOX_PUBLIC_TOKEN to Edge Function secrets.'
        }), 
        { 
          status: 500,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        token,
        status: 'success'
      }), 
      { 
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=3600' // Cache for 1 hour
        }
      }
    )
  } catch (error) {
    console.error('Error in get-mapbox-token function:', {
      error,
      message: error.message,
      stack: error.stack
    })
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }), 
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})

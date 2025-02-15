
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

console.log('Initializing get-mapbox-token function')

serve(async (req: Request) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      })
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ 
          error: 'Method not allowed' 
        }), 
        { 
          status: 405,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    const token = Deno.env.get('MAPBOX_PUBLIC_TOKEN')
    console.log('Processing token request:', {
      timestamp: new Date().toISOString(),
      hasToken: !!token,
      method: req.method
    })
    
    if (!token) {
      console.error('MAPBOX_PUBLIC_TOKEN not found in environment')
      return new Response(
        JSON.stringify({ 
          error: 'Configuration error',
          details: 'Mapbox token not configured'
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

    const response = {
      token,
      status: 'success',
      timestamp: new Date().toISOString()
    }

    console.log('Sending successful response')
    
    return new Response(
      JSON.stringify(response), 
      { 
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=3600'
        }
      }
    )
  } catch (error) {
    console.error('Error in get-mapbox-token function:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        timestamp: new Date().toISOString()
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

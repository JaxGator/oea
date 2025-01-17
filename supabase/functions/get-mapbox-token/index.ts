import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Received request for Mapbox token')

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    })
  }

  try {
    const token = Deno.env.get('MAPBOX_PUBLIC_TOKEN')
    if (!token) {
      console.error('MAPBOX_PUBLIC_TOKEN not found in environment')
      return new Response(
        JSON.stringify({ 
          error: 'Map configuration not found',
          details: 'MAPBOX_PUBLIC_TOKEN environment variable is not set'
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

    console.log('Successfully retrieved Mapbox token')
    return new Response(
      JSON.stringify({ token }),
      { 
        status: 200,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  } catch (error) {
    console.error('Error in get-mapbox-token function:', error)
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
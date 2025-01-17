import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting Mapbox token fetch...')
    
    const token = Deno.env.get('MAPBOX_PUBLIC_TOKEN')
    console.log('Token retrieved:', token ? 'Found' : 'Not found')
    
    if (!token) {
      console.error('Mapbox token not found in environment variables')
      return new Response(
        JSON.stringify({ 
          error: 'Mapbox token not configured',
          details: 'Missing environment variable MAPBOX_PUBLIC_TOKEN'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Successfully retrieved Mapbox token')
    
    return new Response(
      JSON.stringify({ token }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in get-mapbox-token function:', error.message)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
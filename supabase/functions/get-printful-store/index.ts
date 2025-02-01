import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting Printful API request...')
    
    const printfulApiKey = Deno.env.get('PRINTFUL_API_KEY')
    if (!printfulApiKey) {
      console.error('Printful API key not configured')
      throw new Error('Printful API key not configured')
    }

    // Use the sync variants endpoint instead of store products
    console.log('Fetching sync variants...')
    const response = await fetch('https://api.printful.com/sync/variants', {
      headers: {
        'Authorization': `Bearer ${printfulApiKey}`,
        'Content-Type': 'application/json'
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API request failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      throw new Error(`Failed to fetch products: ${errorText}`)
    }

    const data = await response.json()
    console.log('Successfully retrieved products:', {
      count: data.result.length,
      firstProduct: data.result[0]?.sync_variant?.name
    })
    
    // Format the response to match our expected structure
    const formattedProducts = data.result.map((item: any) => ({
      id: item.id,
      name: item.sync_variant.name,
      thumbnail_url: item.sync_variant.files[0]?.preview_url || item.sync_product.thumbnail_url,
      retail_price: item.retail_price,
    }))

    return new Response(JSON.stringify({ result: formattedProducts }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error in get-printful-store function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  }
})
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

    // First, get the list of products
    console.log('Fetching product catalog...')
    const productsResponse = await fetch('https://api.printful.com/products', {
      headers: {
        'Authorization': `Bearer ${printfulApiKey}`,
        'Content-Type': 'application/json'
      },
    })

    if (!productsResponse.ok) {
      const errorText = await productsResponse.text()
      console.error('Products fetch error:', {
        status: productsResponse.status,
        statusText: productsResponse.statusText,
        error: errorText
      })
      throw new Error(`Failed to fetch products: ${errorText}`)
    }

    const productsData = await productsResponse.json()
    console.log('Successfully retrieved products:', {
      count: productsData.result.length,
      firstProduct: productsData.result[0]?.name
    })

    // Take only the first 3 products from the catalog
    const selectedProducts = productsData.result.slice(0, 3)

    // Format the response with sample data since we're using the catalog
    const formattedProducts = selectedProducts.map((product: any) => ({
      id: product.id,
      name: product.title,
      thumbnail_url: product.image,
      retail_price: '29.99' // Sample price since catalog products don't have prices
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
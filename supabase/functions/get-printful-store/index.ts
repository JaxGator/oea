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
    console.log('Starting Printful API request for OEA store...')
    
    const printfulApiKey = Deno.env.get('PRINTFUL_API_KEY')
    if (!printfulApiKey) {
      console.error('Printful API key not configured')
      throw new Error('Printful API key not configured')
    }

    // First, get the store information to ensure we're connected
    console.log('Fetching store information...')
    const storeResponse = await fetch('https://api.printful.com/store', {
      headers: {
        'Authorization': `Bearer ${printfulApiKey}`,
        'Content-Type': 'application/json'
      },
    })

    if (!storeResponse.ok) {
      const errorText = await storeResponse.text()
      console.error('Store fetch error:', {
        status: storeResponse.status,
        statusText: storeResponse.statusText,
        error: errorText
      })
      throw new Error(`Failed to fetch store information: ${errorText}`)
    }

    const storeData = await storeResponse.json()
    console.log('Store information retrieved:', {
      name: storeData.result.name,
      id: storeData.result.id
    })

    // Now fetch the store's products
    console.log('Fetching store products...')
    const productsResponse = await fetch('https://api.printful.com/store/products', {
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

    const data = await productsResponse.json()
    console.log('Successfully retrieved products:', {
      count: data.result.length,
      firstProduct: data.result[0]?.name
    })
    
    // Format the response to include only necessary product information
    const formattedProducts = data.result.map((product: any) => ({
      id: product.id,
      name: product.name,
      thumbnail_url: product.thumbnail_url,
      retail_price: product.retail_price,
      sync_product: {
        name: product.sync_product?.name,
        thumbnail_url: product.sync_product?.thumbnail_url,
        retail_price: product.sync_product?.retail_price
      }
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
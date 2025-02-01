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

    console.log('Making request to Printful API for store products...')
    // First get the store information
    const storeResponse = await fetch('https://api.printful.com/stores', {
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
      throw new Error(`Failed to fetch store info: ${errorText}`)
    }

    const storeData = await storeResponse.json()
    const storeId = storeData.result[0]?.id
    
    if (!storeId) {
      throw new Error('No store ID found')
    }

    console.log('Retrieved store ID:', storeId)

    // Now get the products using the store ID
    const productsResponse = await fetch(`https://api.printful.com/store/products?store_id=${storeId}`, {
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
        error: errorText,
        headers: Object.fromEntries(productsResponse.headers.entries())
      })
      throw new Error(`Failed to fetch products: ${errorText}`)
    }

    const productsData = await productsResponse.json()
    console.log('Successfully retrieved products:', {
      count: productsData.result.length,
      firstProduct: productsData.result[0]
    })

    // Format the response with actual store data
    const formattedProducts = await Promise.all(productsData.result.map(async (product: any) => {
      // Fetch variant details to get accurate pricing
      const variantResponse = await fetch(`https://api.printful.com/store/products/${product.id}?store_id=${storeId}`, {
        headers: {
          'Authorization': `Bearer ${printfulApiKey}`,
          'Content-Type': 'application/json'
        },
      })
      
      if (!variantResponse.ok) {
        console.error(`Failed to fetch variants for product ${product.id}`)
        return null
      }

      const variantData = await variantResponse.json()
      const variant = variantData.result.sync_variants[0] // Get first variant's price

      return {
        id: product.id,
        name: product.name,
        thumbnail_url: product.thumbnail_url || product.sync_product.thumbnail_url,
        retail_price: variant?.retail_price || '0.00'
      }
    }))

    // Filter out any null products from failed variant fetches
    const validProducts = formattedProducts.filter(product => product !== null)

    return new Response(JSON.stringify({ result: validProducts }), {
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
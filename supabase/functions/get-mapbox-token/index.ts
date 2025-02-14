
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS'
};

console.log("Initializing get-mapbox-token function...");

serve(async (req) => {
  console.log(`Handling ${req.method} request from ${req.headers.get("Origin")}`);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, {
      headers: corsHeaders,
      status: 204
    });
  }

  if (req.method !== "GET") {
    console.log("Invalid method:", req.method);
    return new Response(
      JSON.stringify({
        error: "Method not allowed",
        success: false
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 405
      }
    );
  }

  try {
    const token = Deno.env.get("MAPBOX_PUBLIC_TOKEN");
    console.log("Retrieved token status:", token ? "found" : "not found");
    
    if (!token) {
      console.error("MAPBOX_PUBLIC_TOKEN not found in environment");
      return new Response(
        JSON.stringify({
          error: "Mapbox token not configured",
          success: false
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          },
          status: 500
        }
      );
    }

    // Log successful token retrieval
    console.log("Successfully retrieved Mapbox token");

    return new Response(
      JSON.stringify({
        token,
        success: true
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600"
        },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error in get-mapbox-token:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 500
      }
    );
  }
});

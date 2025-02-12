
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Initializing get-mapbox-token function...");

function createResponse(body: any, status: number = 200, origin: string = "*") {
  return new Response(
    typeof body === 'string' ? body : JSON.stringify(body),
    {
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Origin": origin,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600"
      },
      status
    }
  );
}

serve(async (req) => {
  const requestOrigin = req.headers.get("Origin") || "*";
  console.log(`Handling ${req.method} request from origin: ${requestOrigin}`);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, {
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Origin": requestOrigin,
      },
      status: 204
    });
  }

  if (req.method !== "GET") {
    console.log(`Invalid method: ${req.method}`);
    return createResponse(
      { error: "Method not allowed", success: false },
      405,
      requestOrigin
    );
  }

  try {
    console.log("Fetching Mapbox token...");
    const token = Deno.env.get("MAPBOX_PUBLIC_TOKEN");

    if (!token) {
      console.error("Mapbox token not found in environment variables");
      return createResponse(
        { error: "Mapbox token not configured", success: false },
        500,
        requestOrigin
      );
    }

    console.log("Successfully retrieved Mapbox token");
    return createResponse(
      {
        token,
        success: true,
        timestamp: new Date().toISOString()
      },
      200,
      requestOrigin
    );
  } catch (error) {
    console.error("Error in get-mapbox-token:", error.message);
    return createResponse(
      { error: error.message, success: false },
      500,
      requestOrigin
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { create, getNumericDate } from "https://deno.land/x/djwt@v3.0.1/mod.ts";

async function createStreamToken(userId: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const payload = { user_id: userId, iat: getNumericDate(new Date()) };
  return await create({ alg: "HS256", typ: "JWT" }, payload, key);
}

async function createServerToken(secret: string) {
  // Server-side token (no exp, no user_id) for admin REST calls
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return await create({ alg: "HS256", typ: "JWT" }, { server: true }, key);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const STREAM_API_KEY = Deno.env.get("STREAM_API_KEY");
    const STREAM_API_SECRET = Deno.env.get("STREAM_API_SECRET");

    if (!STREAM_API_KEY || !STREAM_API_SECRET) {
      throw new Error("Stream API credentials missing");
    }

    const { user } = await req.json();
    if (!user?.id) throw new Error("Valid user ID is required");

    // Generate user token (this is what the client needs)
    const token = await createStreamToken(user.id, STREAM_API_SECRET);
    console.log("Token generated for user:", user.id);

    // Best-effort upsert via Stream REST API
    try {
      const serverToken = await createServerToken(STREAM_API_SECRET);
      const upsertRes = await fetch(
        `https://chat.stream-io-api.com/users?api_key=${STREAM_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Stream-Auth-Type": "jwt",
            Authorization: serverToken,
          },
          body: JSON.stringify({
            users: {
              [user.id]: {
                id: user.id,
                name: user.name || user.id,
                image: user.image,
              },
            },
          }),
        },
      );
      if (!upsertRes.ok) {
        const errText = await upsertRes.text();
        console.warn("User upsert non-OK (non-critical):", upsertRes.status, errText);
      } else {
        console.log("User upserted successfully");
      }
    } catch (upsertError) {
      console.warn("User upsert failed (non-critical):", upsertError);
    }

    return new Response(JSON.stringify({ result: { token } }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in upsert-stream-user:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});

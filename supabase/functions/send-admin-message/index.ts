
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const FUNCTION_NAME = 'send-admin-message';

interface MessageRequest {
  message: string;
}

serve(async (req) => {
  console.log(`[${FUNCTION_NAME}] Function started`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`[${FUNCTION_NAME}] Handling CORS preflight request`);
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceRole) {
      console.error(`[${FUNCTION_NAME}] Missing environment variables`);
      throw new Error('Server configuration error');
    }

    // Create Supabase client
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRole
    );

    // Parse and validate request body
    let requestBody: MessageRequest;
    try {
      requestBody = await req.json();
      console.log(`[${FUNCTION_NAME}] Received request:`, { messageLength: requestBody?.message?.length });
    } catch (error) {
      console.error(`[${FUNCTION_NAME}] Invalid request body:`, error);
      throw new Error('Invalid request format');
    }

    const { message } = requestBody;

    if (!message?.trim()) {
      console.error(`[${FUNCTION_NAME}] Validation failed: Message is required`);
      throw new Error('Message is required');
    }

    // Get all admin users with retry logic
    let retryCount = 0;
    const maxRetries = 3;
    let adminProfiles = null;
    let adminError = null;

    while (retryCount < maxRetries && !adminProfiles) {
      console.log(`[${FUNCTION_NAME}] Fetching admin profiles (attempt ${retryCount + 1})`);
      
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('is_admin', true);

      if (!error && data) {
        adminProfiles = data;
        break;
      }

      adminError = error;
      retryCount++;
      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }

    if (!adminProfiles) {
      console.error(`[${FUNCTION_NAME}] Error fetching admin profiles after ${maxRetries} attempts:`, adminError);
      throw new Error('Failed to fetch administrators');
    }

    if (!adminProfiles.length) {
      console.error(`[${FUNCTION_NAME}] No administrators found`);
      throw new Error('No administrators found');
    }

    console.log(`[${FUNCTION_NAME}] Found ${adminProfiles.length} admin(s), creating messages`);

    // Create messages for each admin with individual error handling
    const results = await Promise.allSettled(
      adminProfiles.map(admin => 
        supabaseAdmin
          .from('messages')
          .insert({
            sender_id: null,
            receiver_id: admin.id,
            content: message,
            type: 'system'
          })
      )
    );

    const failures = results.filter(r => r.status === 'rejected');
    const successes = results.filter(r => r.status === 'fulfilled');

    if (failures.length > 0) {
      console.error(`[${FUNCTION_NAME}] Some messages failed to send:`, failures);
      if (successes.length === 0) {
        throw new Error('Failed to send message to administrators');
      }
    }

    console.log(`[${FUNCTION_NAME}] Successfully sent ${successes.length} messages`);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        sent: successes.length,
        failed: failures.length
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    );
  } catch (error) {
    console.error(`[${FUNCTION_NAME}] Error:`, error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        success: false
      }), 
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: error instanceof Error && error.message === 'Invalid request format' ? 400 : 500
      }
    );
  }
});

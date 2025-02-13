
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

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

    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRole
    );

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

    // Get all admin users
    const { data: adminProfiles, error: adminError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('is_admin', true);

    if (adminError || !adminProfiles?.length) {
      console.error(`[${FUNCTION_NAME}] Error fetching admin profiles:`, adminError);
      throw new Error('Failed to fetch administrators');
    }

    console.log(`[${FUNCTION_NAME}] Found ${adminProfiles.length} admin(s), creating notifications`);

    // Create admin notifications
    const { error: notificationError } = await supabaseAdmin
      .from('admin_notifications')
      .insert(
        adminProfiles.map(admin => ({
          type: 'contact_message',
          message: message,
          metadata: {
            source: 'contact_form',
            timestamp: new Date().toISOString()
          },
          user_id: admin.id
        }))
      );

    if (notificationError) {
      console.error(`[${FUNCTION_NAME}] Error creating notifications:`, notificationError);
      throw new Error('Failed to create notifications');
    }

    console.log(`[${FUNCTION_NAME}] Successfully created notifications for ${adminProfiles.length} admin(s)`);

    return new Response(
      JSON.stringify({ 
        success: true,
        notified: adminProfiles.length
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


import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  eventId: string;
  userId: string;
  type: 'confirmation' | 'cancellation';
}

const formatTime = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Edge function invoked with method:', req.method);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      }
    });
  }

  try {
    // Validate request method
    if (req.method !== "POST") {
      throw new Error(`HTTP method ${req.method} is not allowed`);
    }

    // Validate RESEND_API_KEY
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      throw new Error('Email service is not configured');
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase credentials missing');
      throw new Error('Database configuration missing');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse and validate request body
    let body;
    try {
      body = await req.json() as EmailRequest;
      console.log('Received request body:', body);
    } catch (error) {
      console.error('Error parsing request body:', error);
      throw new Error('Invalid request body');
    }

    const { eventId, userId, type } = body;
    
    if (!eventId || !userId || !type) {
      throw new Error('Missing required fields');
    }

    console.log(`Processing ${type} email for event ${eventId} and user ${userId}`);

    // Fetch event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError) {
      console.error('Error fetching event:', eventError);
      throw new Error(`Event not found: ${eventError.message}`);
    }

    if (!event) {
      console.error('Event not found for ID:', eventId);
      throw new Error('Event not found');
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw new Error(`User profile not found: ${profileError.message}`);
    }

    if (!profile || !profile.email) {
      console.error('Profile or email not found for ID:', userId);
      throw new Error('User email not found');
    }

    // Format date and time
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const eventTime = formatTime(event.time);

    // Get email template
    const templateName = type === 'confirmation' ? 'rsvp_confirmation' : 'rsvp_cancellation';
    console.log('Attempting to fetch template:', templateName);
    
    const { data: template, error: templateError } = await supabase
      .from('message_templates')
      .select('*')
      .eq('name', templateName)
      .maybeSingle();

    if (templateError) {
      console.error('Error fetching template:', templateError);
      throw new Error(`Template fetch error: ${templateError.message}`);
    }

    if (!template) {
      console.error('Template not found:', templateName);
      throw new Error(`Email template '${templateName}' not found`);
    }

    console.log('Successfully found template:', template.name);

    // Replace template variables
    let emailContent = template.content
      .replace('{event_title}', event.title)
      .replace('{event_date}', eventDate)
      .replace('{event_time}', eventTime)
      .replace('{event_location}', event.location)
      .replace('{user_name}', profile.full_name || 'User');

    let emailSubject = template.subject
      .replace('{event_title}', event.title)
      .replace('{user_name}', profile.full_name || 'User');

    console.log('Sending email with Resend API...');
    
    // Send email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "OEA Events <events@resend.dev>",
        to: profile.email,
        subject: emailSubject,
        html: emailContent,
      }),
    });

    if (!res.ok) {
      const resendError = await res.json();
      console.error('Resend API error:', resendError);
      throw new Error(`Failed to send email: ${resendError.message || 'Unknown error'}`);
    }

    const resendResponse = await res.json();
    console.log('Resend API response:', resendResponse);

    return new Response(
      JSON.stringify({ success: true, data: resendResponse }), 
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error('Error in send-rsvp-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.stack
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        }
      }
    );
  }
};

serve(handler);

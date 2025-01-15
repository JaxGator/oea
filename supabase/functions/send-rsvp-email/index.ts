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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate RESEND_API_KEY
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      throw new Error('Email service is not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { eventId, userId, type } = await req.json() as EmailRequest;
    console.log(`Processing ${type} email for event ${eventId} and user ${userId}`);

    // Fetch event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      console.error('Error fetching event:', eventError);
      throw new Error('Event not found');
    }

    // Fetch user details
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching profile:', profileError);
      throw new Error('User profile not found');
    }

    // Format date and time
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const eventTime = event.time.slice(0, 5); // Format HH:mm

    // Get email template
    const templateName = type === 'confirmation' ? 'rsvp_confirmation' : 'rsvp_cancellation';
    console.log('Fetching template:', templateName);
    
    const { data: template, error: templateError } = await supabase
      .from('message_templates')
      .select('*')
      .eq('name', templateName)
      .single();

    if (templateError || !template) {
      console.error('Error fetching template:', templateError);
      throw new Error('Email template not found');
    }

    console.log('Template found:', template.name);

    // Replace template variables
    let emailContent = template.content
      .replace('{user_name}', profile.full_name || profile.username)
      .replace('{event_title}', event.title)
      .replace('{event_date}', eventDate)
      .replace('{event_time}', eventTime)
      .replace('{event_location}', event.location);

    let emailSubject = template.subject.replace('{event_title}', event.title);

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
        to: [profile.email],
        subject: emailSubject,
        html: emailContent,
      }),
    });

    const resendResponse = await res.json();
    console.log('Resend API response:', resendResponse);

    if (!res.ok) {
      console.error('Resend API error:', resendResponse);
      throw new Error(`Failed to send email: ${resendResponse.message || 'Unknown error'}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error in send-rsvp-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
};

serve(handler);
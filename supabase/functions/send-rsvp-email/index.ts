
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { format } from "npm:date-fns@3.0.0";

// Initialize Resend with API key
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RSVPEmailRequest {
  eventId: string;
  userId: string;
  type: "confirmation" | "cancellation" | "reminder";
  eventDetails?: {
    title: string;
    date: string;
    time: string;
    location: string;
  } | null;
  userProfile?: {
    full_name: string;
    email: string;
  } | null;
  guestCount?: number;
}

// Create a Supabase client for the function
const createClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
  
  // We need to create our own fetch function with Deno compatibility
  const fetch = (url: string, options: any) => {
    return globalThis.fetch(url, options);
  };
  
  // Import the Supabase JS library dynamically
  return import("npm:@supabase/supabase-js@2.38.4").then(({ createClient }) =>
    createClient(supabaseUrl, supabaseKey, { 
      global: { fetch },
      auth: { persistSession: false }
    })
  );
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const requestData: RSVPEmailRequest = await req.json();
    console.log("Received request body:", JSON.stringify(requestData, null, 2));

    const { eventId, userId, type, eventDetails, userProfile, guestCount = 0 } = requestData;

    // Create Supabase client
    const supabase = await createClient();

    // Fetch data if not provided in request
    let event = eventDetails;
    let profile = userProfile;

    if (!event) {
      // Fetch event data
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("title, date, time, location")
        .eq("id", eventId)
        .single();

      if (eventError) {
        console.error("Error fetching event data:", eventError);
        throw new Error("Failed to fetch event data");
      }

      event = eventData;
    }

    if (!profile) {
      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("id", userId)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
        throw new Error("Failed to fetch user data");
      }

      profile = userData;
    }

    if (!profile?.email) {
      // Fetch user email from auth if not in profile
      const { data: authData, error: authError } = await supabase.auth.admin.getUserById(userId);
      
      if (authError) {
        console.error("Error fetching auth user:", authError);
        throw new Error("Failed to fetch user email");
      }
      
      if (!profile) {
        profile = { email: authData.user.email, full_name: authData.user.email.split('@')[0] };
      } else {
        profile.email = authData.user.email;
      }
    }

    // Format the event date
    const formattedDate = event.date 
      ? format(new Date(event.date), "EEEE, MMMM d, yyyy")
      : 'Date to be announced';

    // Create appropriate email content based on type
    let subject = '';
    let htmlContent = '';

    if (type === "confirmation") {
      subject = `RSVP Confirmation: ${event.title}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4a5568;">RSVP Confirmation</h2>
          <p>Hello ${profile.full_name || "there"},</p>
          <p>Thank you for your RSVP to <strong>${event.title}</strong>. We're looking forward to seeing you!</p>
          
          <div style="background-color: #f7fafc; border-left: 4px solid #4299e1; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2d3748;">Event Details</h3>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${event.time || "TBA"}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            ${guestCount > 0 ? `<p><strong>Guests:</strong> ${guestCount}</p>` : ''}
          </div>
          
          <p>If you need to cancel or modify your RSVP, please visit the event page on our website.</p>
          <p>We look forward to seeing you there!</p>
          <p>Best regards,<br>The Event Team</p>
        </div>
      `;
    } else if (type === "cancellation") {
      subject = `RSVP Cancellation: ${event.title}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4a5568;">RSVP Cancellation</h2>
          <p>Hello ${profile.full_name || "there"},</p>
          <p>Your RSVP for <strong>${event.title}</strong> has been canceled as requested.</p>
          
          <div style="background-color: #f7fafc; border-left: 4px solid #fc8181; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2d3748;">Event Details</h3>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${event.time || "TBA"}</p>
            <p><strong>Location:</strong> ${event.location}</p>
          </div>
          
          <p>If you wish to RSVP again, please visit the event page on our website.</p>
          <p>Best regards,<br>The Event Team</p>
        </div>
      `;
    } else if (type === "reminder") {
      subject = `Event Reminder: ${event.title}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4a5568;">Event Reminder</h2>
          <p>Hello ${profile.full_name || "there"},</p>
          <p>This is a friendly reminder about <strong>${event.title}</strong> that you've RSVP'd to.</p>
          
          <div style="background-color: #f7fafc; border-left: 4px solid #68d391; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2d3748;">Event Details</h3>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${event.time || "TBA"}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            ${guestCount > 0 ? `<p><strong>Guests:</strong> ${guestCount}</p>` : ''}
          </div>
          
          <p>We look forward to seeing you there!</p>
          <p>Best regards,<br>The Event Team</p>
        </div>
      `;
    }

    console.log("Sending email to:", profile.email);

    // Send email using Resend
    const { data: emailData, error: sendError } = await resend.emails.send({
      from: "Event Team <onboarding@resend.dev>",
      to: [profile.email],
      subject: subject,
      html: htmlContent,
    });

    if (sendError) {
      console.error("Error sending email:", sendError);
      throw sendError;
    }

    console.log("Email sent successfully:", emailData);

    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully", data: emailData }),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
      }
    );

  } catch (error) {
    console.error("Error in send-rsvp-email function:", error);
    
    // Return error response
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to send email", 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
      }
    );
  }
});

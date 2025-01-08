import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
);

async function sendReminderEmail(to: string, eventDetails: any) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Lovable Events <events@resend.dev>',
        to: [to],
        subject: `Reminder: ${eventDetails.title} is coming up!`,
        html: `
          <div>
            <h2>Event Reminder: ${eventDetails.title}</h2>
            <p>This is a reminder that you have an upcoming event:</p>
            <ul>
              <li>Date: ${eventDetails.date}</li>
              <li>Time: ${eventDetails.time}</li>
              <li>Location: ${eventDetails.location}</li>
            </ul>
            <p>${eventDetails.description || ''}</p>
            <a href="${SUPABASE_URL}/events/${eventDetails.id}" style="background-color: #0d97d1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
              View Event Details
            </a>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending reminder email:', error);
    throw error;
  }
}

async function processReminders() {
  const now = new Date();
  const { data: reminders, error } = await supabase
    .from('event_reminders')
    .select(`
      *,
      events (
        id,
        title,
        description,
        date,
        time,
        location
      ),
      profiles (
        email
      )
    `)
    .eq('notification_status', 'pending')
    .lte('reminder_time', now.toISOString());

  if (error) {
    console.error('Error fetching reminders:', error);
    throw error;
  }

  for (const reminder of reminders || []) {
    try {
      await sendReminderEmail(
        reminder.profiles.email,
        reminder.events
      );

      await supabase
        .from('event_reminders')
        .update({ notification_status: 'sent' })
        .eq('id', reminder.id);

    } catch (error) {
      console.error(`Failed to process reminder ${reminder.id}:`, error);
      
      await supabase
        .from('event_reminders')
        .update({ 
          notification_status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', reminder.id);
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    await processReminders();
    return new Response(
      JSON.stringify({ message: 'Reminders processed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing reminders:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

async function sendReminderEmail(to: string, eventDetails: any) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'OEA Events <events@oea.com>',
      to: [to],
      subject: `Reminder: ${eventDetails.title} is coming up!`,
      html: `
        <h1>Event Reminder</h1>
        <p>Hello!</p>
        <p>This is a reminder that you're registered for ${eventDetails.title}.</p>
        <p>Date: ${eventDetails.date}</p>
        <p>Time: ${eventDetails.time}</p>
        <p>Location: ${eventDetails.location}</p>
        <a href="${SUPABASE_URL}/events/${eventDetails.id}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">
          View Event Details
        </a>
      `,
    }),
  });

  return res.ok;
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
    return;
  }

  for (const reminder of reminders) {
    try {
      const success = await sendReminderEmail(
        reminder.profiles.email,
        reminder.events
      );

      await supabase
        .from('event_reminders')
        .update({
          notification_status: success ? 'sent' : 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', reminder.id);

      if (!success) {
        console.error(`Failed to send reminder ${reminder.id}`);
      }
    } catch (error) {
      console.error(`Error processing reminder ${reminder.id}:`, error);
      
      await supabase
        .from('event_reminders')
        .update({
          notification_status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', reminder.id);
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    await processReminders();
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in process-reminders function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
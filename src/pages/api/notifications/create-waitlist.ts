
import { supabase } from "@/integrations/supabase/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { eventId, userId, notificationType } = req.body;
  
  if (!eventId || !userId || !notificationType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Insert directly using any typing to bypass TypeScript limitations
    const { data, error } = await supabase
      .from('waitlist_notifications')
      .insert({
        event_id: eventId,
        user_id: userId,
        notification_type: notificationType
      } as any);
    
    if (error) {
      console.error('Error creating waitlist notification:', error);
      return res.status(500).json({ error: 'Failed to create waitlist notification' });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error handling waitlist notification creation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

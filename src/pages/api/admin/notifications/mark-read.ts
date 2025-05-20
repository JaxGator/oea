
import { supabase } from "@/integrations/supabase/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'Missing notification id' });
  }

  try {
    // Use any type to bypass TypeScript limitations
    const { error } = await supabase
      .from('admin_notifications' as any)
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
      return res.status(500).json({ error: 'Failed to mark notification as read' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling mark notification as read request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

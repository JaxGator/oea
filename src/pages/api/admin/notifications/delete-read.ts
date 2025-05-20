
import { supabase } from "@/integrations/supabase/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Use any type to bypass TypeScript limitations
    const { error } = await supabase
      .from('admin_notifications' as any)
      .delete()
      .eq('is_read', true);

    if (error) {
      console.error('Error deleting read notifications:', error);
      return res.status(500).json({ error: 'Failed to delete read notifications' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling delete read notifications request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


import { supabase } from "@/integrations/supabase/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Use any type to bypass TypeScript limitations
    const { data, error } = await supabase
      .from('auth_notifications' as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching auth notifications:', error);
      return res.status(500).json({ error: 'Failed to fetch auth notifications' });
    }

    return res.status(200).json(data || []);
  } catch (error) {
    console.error('Error handling auth notifications request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

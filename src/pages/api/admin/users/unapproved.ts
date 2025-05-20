
import { supabase } from "@/integrations/supabase/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_approved', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching unapproved users:', error);
      return res.status(500).json({ error: 'Failed to fetch unapproved users' });
    }

    return res.status(200).json(data || []);
  } catch (error) {
    console.error('Error handling unapproved users request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

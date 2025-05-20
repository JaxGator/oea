
import { supabase } from "@/integrations/supabase/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Use raw SQL query to avoid TypeScript issues
    const { data, error } = await supabase.rpc('get_payments_count');
    
    if (error) {
      console.error('Error fetching payments count:', error);
      return res.status(500).json({ error: 'Failed to fetch payments count' });
    }

    return res.status(200).json({ count: data || 0 });
  } catch (error) {
    console.error('Error handling payments count:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

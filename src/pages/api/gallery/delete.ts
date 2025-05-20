
import { supabase } from "@/integrations/supabase/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileName } = req.body;
  
  if (!fileName) {
    return res.status(400).json({ error: 'Missing file name' });
  }

  try {
    // Delete from database directly
    const { error: dbError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('file_name', fileName);

    if (dbError) {
      console.error('Database deletion error:', dbError);
      return res.status(500).json({ error: 'Failed to delete from database', details: dbError });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling gallery delete:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

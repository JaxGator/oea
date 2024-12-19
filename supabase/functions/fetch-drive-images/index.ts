import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { google } from "npm:googleapis@126.0.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: Deno.env.get("GOOGLE_CLIENT_EMAIL"),
        private_key: Deno.env.get("GOOGLE_PRIVATE_KEY")?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });
    const folderId = Deno.env.get("GOOGLE_DRIVE_FOLDER_ID");

    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'files(id, name, webContentLink, thumbnailLink)',
      orderBy: 'createdTime desc',
    });

    const files = response.data.files?.map(file => ({
      id: file.id,
      name: file.name,
      url: `https://drive.google.com/uc?id=${file.id}`,
      thumbnail: file.thumbnailLink,
    })) || [];

    return new Response(
      JSON.stringify({ files }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching Drive images:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
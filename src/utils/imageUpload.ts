import { supabase } from "@/integrations/supabase/client";

export type ImageType = 'metaImage' | 'favicon' | 'default';

export async function uploadImage(file: File, imageType: ImageType) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload an image file');
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User must be authenticated to upload images');
  }

  const arrayBuffer = await file.arrayBuffer();
  const fileData = new Uint8Array(arrayBuffer);

  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  // Create a folder structure with user ID
  const fileName = `${user.id}/${imageType}-${timestamp}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(fileName, fileData, {
      contentType: file.type,
      duplex: 'half',
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(fileName);

  return publicUrl;
}
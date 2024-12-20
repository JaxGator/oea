import { supabase } from "@/integrations/supabase/client";

export type ImageType = 'metaImage' | 'favicon';

export async function uploadImage(file: File, imageType: ImageType) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload an image file');
  }

  const arrayBuffer = await file.arrayBuffer();
  const fileData = new Uint8Array(arrayBuffer);

  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const fileName = `${imageType}-${timestamp}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(fileName, fileData, {
      contentType: file.type,
      duplex: 'half',
      cacheControl: '3600'
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(fileName);

  return publicUrl;
}
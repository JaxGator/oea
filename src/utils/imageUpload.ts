import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UploadResult {
  fileName: string;
  publicUrl: string;
}

export async function uploadImageToStorage(
  file: File,
  bucket: 'gallery' | 'media' = 'gallery'
): Promise<UploadResult> {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const fileExt = file.name.split('.').pop();
  const fileName = `${timestamp}-${randomString}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false
    });

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return { fileName, publicUrl };
}

export async function deleteImageFromStorage(
  fileName: string,
  bucket: 'gallery' | 'media' = 'gallery'
): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([fileName]);

  if (error) {
    console.error('Storage delete error:', error);
    throw error;
  }
}
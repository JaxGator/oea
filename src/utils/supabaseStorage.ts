import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export async function getSignedUrl(fileName: string): Promise<string | null> {
  try {
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error in getSignedUrl:', error);
    return null;
  }
}

export async function uploadImage(file: File): Promise<{ fileName: string; error: Error | null }> {
  const fileName = `${Date.now()}-${file.name}`;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    return { fileName, error: null };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { fileName: '', error: error as Error };
  }
}

export async function deleteImage(fileName: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase.storage
      .from('gallery')
      .remove([fileName]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}
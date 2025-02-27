
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const uploadFile = async (
  file: File,
  bucket: string,
  path?: string,
  customFileName?: string
): Promise<string | null> => {
  try {
    // Create a unique filename if not provided
    const fileName = customFileName || `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Construct the full path
    const fullPath = path ? `${path}/${fileName}` : fileName;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw error;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error("Failed to upload file");
    return null;
  }
};

export const deleteFile = async (
  path: string,
  bucket: string
): Promise<boolean> => {
  try {
    // Extract the file path from a public URL if needed
    let filePath = path;
    if (path.includes('supabase.co')) {
      // Extract the path after the bucket name
      const parts = path.split(`/${bucket}/`);
      if (parts.length > 1) {
        filePath = parts[1].split('?')[0]; // Remove query parameters
      }
    }
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) {
      throw error;
    }
    
    toast.success("File deleted successfully");
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    toast.error("Failed to delete file");
    return false;
  }
};

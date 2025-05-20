
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function handleImageDelete(imageUrl: string, onSuccess: (imageUrl: string) => void) {
  try {
    // Extract the filename from the URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    if (!fileName) {
      throw new Error('Invalid image URL');
    }

    // First try to delete using RPC to avoid type issues
    try {
      await supabase.rpc('delete_gallery_image', {
        p_file_name: fileName
      });
    } catch (rpcError) {
      console.warn('RPC delete failed, trying direct API:', rpcError);
      
      // Fallback to direct API if RPC is not available
      // Delete from storage first
      await supabase.storage
        .from('gallery')
        .remove([fileName]);
        
      // Then use a fetch request to delete from database
      await fetch('/api/gallery/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName })
      });
    }

    onSuccess(imageUrl);
    toast.success("Image deleted successfully");
  } catch (error) {
    console.error('Error deleting image:', error);
    toast.error(error instanceof Error ? error.message : "Failed to delete image");
  }
}

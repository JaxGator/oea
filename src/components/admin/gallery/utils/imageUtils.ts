
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export async function handleImageDelete(imageUrl: string, onSuccess: (imageUrl: string) => void) {
  try {
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    if (!fileName) {
      throw new Error('Invalid image URL');
    }

    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('file_name', fileName);

    if (error) {
      throw new Error(error.message || 'Failed to delete image');
    }

    onSuccess(imageUrl);
    toast.success("Image deleted successfully");
  } catch (error) {
    console.error('Error deleting image:', error);
    toast.error(error instanceof Error ? error.message : "Failed to delete image");
  }
}

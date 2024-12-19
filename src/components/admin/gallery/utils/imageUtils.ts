import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export async function handleImageDelete(imageUrl: string, onSuccess: (imageUrl: string) => void) {
  try {
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return;

    const { error } = await supabase.storage
      .from('gallery')
      .remove([fileName]);

    if (error) throw error;

    const { error: dbError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('file_name', fileName);

    if (dbError) throw dbError;

    onSuccess(imageUrl);
    toast({
      title: "Success",
      description: "Image deleted successfully",
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    toast({
      title: "Error",
      description: "Failed to delete image",
      variant: "destructive",
    });
  }
}
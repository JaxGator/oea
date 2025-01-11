import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export async function handleImageDelete(imageUrl: string, onSuccess: (imageUrl: string) => void) {
  try {
    // Extract the filename from the URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    if (!fileName) {
      throw new Error('Invalid image URL');
    }

    // First delete from storage
    const { error: storageError } = await supabase.storage
      .from('gallery')
      .remove([fileName]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
      throw storageError;
    }

    // Then delete from the database
    const { error: dbError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('file_name', fileName);

    if (dbError) {
      console.error('Database deletion error:', dbError);
      throw dbError;
    }

    onSuccess(imageUrl);
    toast({
      title: "Success",
      description: "Image deleted successfully",
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to delete image",
      variant: "destructive",
    });
  }
}
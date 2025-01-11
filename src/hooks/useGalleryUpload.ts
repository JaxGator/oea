import { useState } from "react";
import { useSession } from "@/hooks/auth/useSession";
import { supabase } from "@/integrations/supabase/client";
import { uploadImageToStorage, deleteImageFromStorage } from "@/utils/imageUpload";
import { toast } from "@/hooks/use-toast";

export function useGalleryUpload(onUploadComplete?: () => void) {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useSession();

  const uploadImage = async (file: File) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload images",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const { fileName, publicUrl } = await uploadImageToStorage(file);

      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert({
          file_name: fileName,
          display_order: 0,
          user_id: user.id
        });

      if (dbError) {
        console.error('Database error:', dbError);
        await deleteImageFromStorage(fileName);
        throw dbError;
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      onUploadComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadImage,
  };
}
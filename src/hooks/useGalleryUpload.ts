import { useState } from "react";
import { useSession } from "@/hooks/auth/useSession";
import { supabase } from "@/integrations/supabase/client";
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
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomString}.${fileExt}`;

      // First create the database record
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert({
          file_name: fileName,
          user_id: user.id,
          display_order: 0
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      // Then upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        // Clean up the database record if storage upload fails
        await supabase
          .from('gallery_images')
          .delete()
          .eq('file_name', fileName);
        throw uploadError;
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
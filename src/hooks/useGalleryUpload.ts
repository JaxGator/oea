
import { useState } from "react";
import { useSession } from "@/hooks/auth/useSession";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useGalleryUpload(onUploadComplete?: () => void) {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useSession();

  const uploadImage = async (file: File) => {
    if (!user) {
      console.error('Upload attempted without authentication');
      toast({
        title: "Authentication Required",
        description: "You must be logged in to upload images",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting upload process:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      userId: user.id
    });

    setIsUploading(true);
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomString}.${fileExt}`;

      console.log('Generated filename:', fileName);

      // First create the database record
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert({
          file_name: fileName,
          user_id: user.id,
          display_order: 0
        });

      if (dbError) {
        console.error('Database error during record creation:', {
          error: dbError,
          context: {
            fileName,
            userId: user.id
          }
        });
        throw dbError;
      }

      console.log('Database record created successfully');

      // Then upload file to storage with owner metadata
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
          duplex: 'half'
        });

      if (uploadError) {
        console.error('Storage upload error:', {
          error: uploadError,
          context: {
            fileName,
            fileType: file.type,
            bucketName: 'gallery'
          }
        });

        // Clean up the database record if storage upload fails
        const { error: cleanupError } = await supabase
          .from('gallery_images')
          .delete()
          .eq('file_name', fileName);

        if (cleanupError) {
          console.error('Failed to cleanup database record after failed upload:', cleanupError);
        }

        throw uploadError;
      }

      console.log('File uploaded successfully to storage');

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      onUploadComplete?.();
    } catch (error) {
      console.error('Upload process failed:', {
        error,
        context: {
          fileName: file.name,
          fileType: file.type,
          userId: user.id
        }
      });

      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to upload image. Please try again.';

      toast({
        title: "Upload Error",
        description: errorMessage,
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

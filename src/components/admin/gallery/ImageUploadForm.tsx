import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useSession } from "@/hooks/auth/useSession";

interface ImageUploadFormProps {
  onUploadSuccess: () => void;
}

export function ImageUploadForm({ onUploadSuccess }: ImageUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useSession();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

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
      console.log('Starting file upload process...');

      // Create a timestamp-based filename with original extension
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${timestamp}.${fileExt}`;

      console.log('Uploading file:', fileName);

      // First, upload the file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully:', uploadData);

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      // Then create the database record with user_id
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert({
          file_name: fileName,
          display_order: timestamp,
          user_id: user.id // Add the user_id to track ownership
        });

      if (dbError) {
        console.error('Database error:', dbError);
        // If database insert fails, clean up the uploaded file
        await supabase.storage
          .from('gallery')
          .remove([fileName]);
        throw dbError;
      }

      console.log('Database record created successfully');

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        id="gallery-upload"
        disabled={isUploading}
      />
      <label htmlFor="gallery-upload">
        <Button asChild disabled={isUploading}>
          <span>
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </span>
        </Button>
      </label>
    </div>
  );
}
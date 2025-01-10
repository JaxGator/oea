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
      // Create a timestamp-based filename with original extension
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${timestamp}.${fileExt}`;

      console.log('Starting file upload:', {
        fileName,
        fileType: file.type,
        fileSize: file.size,
        userId: user.id
      });

      // First create the database record with user_id
      // Use Math.floor(Date.now() / 1000) to get a reasonable integer for display_order
      const { data: dbData, error: dbError } = await supabase
        .from('gallery_images')
        .insert({
          file_name: fileName,
          display_order: Math.floor(Date.now() / 1000), // Convert to seconds to fit in integer
          user_id: user.id
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      console.log('Database record created:', dbData);

      // Then upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        // Clean up the database record if storage upload fails
        await supabase
          .from('gallery_images')
          .delete()
          .eq('file_name', fileName);
        throw uploadError;
      }

      console.log('File uploaded successfully');

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
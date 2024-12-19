import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageUploadFormProps {
  onUploadSuccess: () => void;
}

export function ImageUploadForm({ onUploadSuccess }: ImageUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type // Explicitly set the content type
        });

      if (uploadError) throw uploadError;

      // Get the highest display order
      const { data: orderData, error: orderError } = await supabase
        .from('gallery_images')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1);

      if (orderError) throw orderError;

      const nextOrder = orderData.length > 0 ? orderData[0].display_order + 1 : 0;

      // Insert record into gallery_images table
      const { error: insertError } = await supabase
        .from('gallery_images')
        .insert({
          file_name: fileName,
          display_order: nextOrder
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
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
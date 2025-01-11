import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useSession } from "@/hooks/auth/useSession";

interface ImageUploadFormProps {
  onUploadComplete: () => void;
}

export function ImageUploadForm({ onUploadComplete }: ImageUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useSession();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      // Generate a unique filename with timestamp and random string
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomString}.${fileExt}`;

      console.log('Starting file upload:', {
        fileName,
        userId: user.id,
        fileSize: file.size,
        contentType: file.type
      });

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      console.log('File uploaded successfully:', {
        fileName,
        publicUrl,
        userId: user.id
      });

      // Create database record with user_id
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert([{
          file_name: fileName,
          display_order: 0,
          user_id: user.id // Explicitly set the user_id
        }]);

      if (dbError) {
        // If database insert fails, clean up the uploaded file
        await supabase.storage.from('gallery').remove([fileName]);
        console.error('Database insert error:', dbError);
        throw dbError;
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      
      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  if (!user) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Please sign in to upload images.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="image">Upload Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </div>
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
}
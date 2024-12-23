import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ImagePreview } from "./components/ImagePreview";
import { UploadButton } from "./components/UploadButton";
import { uploadImage } from "./utils/imageUpload";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => Promise<void>;
};

export function ImageUploadField({ 
  label, 
  value,
  onChange,
  onSave
}: ImageUploadFieldProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const publicUrl = await uploadImage(file, 'default');
      
      onChange(publicUrl);
      await onSave();

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="space-y-2">
        {value && (
          <ImagePreview
            imageUrl={value}
            label={label}
            imageType="default"
          />
        )}
        <UploadButton
          isUploading={isUploading}
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
}
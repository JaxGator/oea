import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ImagePreview } from "./components/ImagePreview";
import { UploadButton } from "./components/UploadButton";
import { uploadImage, ImageType } from "./utils/imageUpload";

type ImageUploadFieldProps = {
  label: string;
  imageUrl: string | undefined;
  configKey: string;
  updateConfig: (key: string, value: string) => Promise<void>;
  setConfigs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  imageType: ImageType;
};

export function ImageUploadField({ 
  label, 
  imageUrl, 
  configKey, 
  updateConfig, 
  setConfigs,
  imageType 
}: ImageUploadFieldProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // Effect to update favicon when it changes
  useEffect(() => {
    if (imageType === 'favicon' && imageUrl) {
      const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (faviconLink) {
        faviconLink.href = imageUrl;
      } else {
        const newFaviconLink = document.createElement('link');
        newFaviconLink.rel = 'icon';
        newFaviconLink.type = 'image/x-icon';
        newFaviconLink.href = imageUrl;
        document.head.appendChild(newFaviconLink);
      }
    }
  }, [imageUrl, imageType]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const publicUrl = await uploadImage(file, imageType);
      
      await updateConfig(configKey, publicUrl);
      setConfigs(prev => ({ ...prev, [configKey]: publicUrl }));

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
        {imageUrl && (
          <ImagePreview
            imageUrl={imageUrl}
            label={label}
            imageType={imageType}
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
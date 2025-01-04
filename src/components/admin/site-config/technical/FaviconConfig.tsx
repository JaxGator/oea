import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ImagePreview } from "./components/ImagePreview";
import { UploadButton } from "./components/UploadButton";
import { uploadImage } from "./utils/imageUpload";
import { Label } from "@/components/ui/label";

interface FaviconConfigProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
}

export function FaviconConfig({ value, onChange, onSave }: FaviconConfigProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(file, 'favicon');
      onChange(imageUrl);
      onSave();
    } catch (error) {
      console.error('Error uploading favicon:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label>Favicon</Label>
        <p className="text-sm text-gray-500">
          Upload a square image (recommended size: 32x32px or larger). It will be displayed in browser tabs.
        </p>
      </div>

      <div className="flex items-start gap-4">
        {value && (
          <ImagePreview
            imageUrl={value}
            label="Favicon"
            imageType="favicon"
          />
        )}
        <div className="space-y-2 flex-1">
          <UploadButton
            isUploading={isUploading}
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ImageUploadFieldProps = {
  label: string;
  imageUrl: string | undefined;
  configKey: string;
  updateConfig: (key: string, value: string) => Promise<void>;
  setConfigs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  imageType: 'metaImage' | 'favicon';
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${imageType}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

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
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="space-y-2">
        {imageUrl && (
          <div className={`relative ${imageType === 'favicon' ? 'w-16 h-16' : 'w-40 h-40'} border rounded-lg overflow-hidden`}>
            <img 
              src={imageUrl} 
              alt={label} 
              className="w-full h-full object-contain"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = '/placeholder.svg';
              }}
            />
          </div>
        )}
        <div className="flex gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          {isUploading && (
            <Button disabled>
              <Upload className="mr-2 h-4 w-4 animate-spin" />
              Uploading
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
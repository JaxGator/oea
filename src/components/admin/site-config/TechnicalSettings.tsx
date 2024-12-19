import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type TechnicalSettingsProps = {
  configs: Record<string, string>;
  setConfigs: (configs: Record<string, string>) => void;
  updateConfig: (key: string, value: string) => Promise<void>;
};

export function TechnicalSettings({ configs, setConfigs, updateConfig }: TechnicalSettingsProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({
    metaImage: false,
    favicon: false
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, imageType: 'metaImage' | 'favicon') => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(prev => ({ ...prev, [imageType]: true }));

      const fileExt = file.name.split('.').pop();
      const fileName = `${imageType}-${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      const configKey = imageType === 'metaImage' ? 'default_meta_image' : 'favicon_url';
      await updateConfig(configKey, publicUrl);
      setConfigs({ ...configs, [configKey]: publicUrl });

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
      setIsUploading(prev => ({ ...prev, [imageType]: false }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Maintenance Mode</label>
          <div className="flex items-center gap-2">
            <Switch
              checked={configs.maintenance_mode === "true"}
              onCheckedChange={(checked) => {
                setConfigs({ ...configs, maintenance_mode: checked.toString() });
                updateConfig('maintenance_mode', checked.toString());
              }}
            />
            <span className="text-sm text-muted-foreground">
              {configs.maintenance_mode === "true" ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Default Meta Image</label>
          <div className="space-y-2">
            {configs.default_meta_image && (
              <img 
                src={configs.default_meta_image} 
                alt="Default meta image" 
                className="h-20 w-auto object-contain"
              />
            )}
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'metaImage')}
                disabled={isUploading.metaImage}
              />
              {isUploading.metaImage && (
                <Button disabled>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Uploading
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Favicon</label>
          <div className="space-y-2">
            {configs.favicon_url && (
              <img 
                src={configs.favicon_url} 
                alt="Favicon" 
                className="h-8 w-auto object-contain"
              />
            )}
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'favicon')}
                disabled={isUploading.favicon}
              />
              {isUploading.favicon && (
                <Button disabled>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Uploading
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Custom CSS</label>
          <div className="flex gap-2">
            <Textarea
              value={configs.custom_css}
              onChange={(e) => setConfigs({ ...configs, custom_css: e.target.value })}
              placeholder="Enter custom CSS"
              className="font-mono"
            />
            <Button
              onClick={() => updateConfig('custom_css', configs.custom_css)}
              className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Custom Scripts</label>
          <div className="flex gap-2">
            <Textarea
              value={configs.custom_scripts}
              onChange={(e) => setConfigs({ ...configs, custom_scripts: e.target.value })}
              placeholder="Enter custom scripts"
              className="font-mono"
            />
            <Button
              onClick={() => updateConfig('custom_scripts', configs.custom_scripts)}
              className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sitemap Configuration</label>
          <div className="flex gap-2">
            <Textarea
              value={configs.sitemap_config}
              onChange={(e) => setConfigs({ ...configs, sitemap_config: e.target.value })}
              placeholder="Enter sitemap configuration in JSON format"
              className="font-mono min-h-[200px]"
            />
            <Button
              onClick={() => updateConfig('sitemap_config', configs.sitemap_config)}
              className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
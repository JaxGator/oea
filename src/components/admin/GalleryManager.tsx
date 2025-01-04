import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploadForm } from "./gallery/ImageUploadForm";
import { ImageGrid } from "./gallery/ImageGrid";
import { GallerySettings } from "./site-config/technical/GallerySettings";
import { useConfigManager } from "./site-config/useConfigManager";

export function GalleryManager() {
  const [selectedTab, setSelectedTab] = useState("upload");
  const { configs, setConfigs, updateConfig } = useConfigManager();

  const handleGallerySettingsSave = async (settings: { carouselEnabled: boolean; carouselInterval: number }) => {
    await updateConfig('gallery_carousel_enabled', settings.carouselEnabled.toString());
    await updateConfig('gallery_carousel_interval', settings.carouselInterval.toString());
    setConfigs(prev => ({
      ...prev,
      gallery_carousel_enabled: settings.carouselEnabled.toString(),
      gallery_carousel_interval: settings.carouselInterval.toString()
    }));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="upload">Upload Images</TabsTrigger>
            <TabsTrigger value="manage">Manage Images</TabsTrigger>
            <TabsTrigger value="settings">Gallery Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <ImageUploadForm />
          </TabsContent>

          <TabsContent value="manage">
            <ImageGrid />
          </TabsContent>

          <TabsContent value="settings">
            <GallerySettings
              carouselEnabled={configs.gallery_carousel_enabled === 'true'}
              carouselInterval={parseInt(configs.gallery_carousel_interval || '5000')}
              onSave={handleGallerySettingsSave}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploadForm } from "./gallery/ImageUploadForm";
import { ImageGrid } from "./gallery/ImageGrid";
import { GallerySettings } from "./site-config/technical/GallerySettings";
import { useConfigManager } from "./site-config/useConfigManager";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function GalleryManager() {
  const [selectedTab, setSelectedTab] = useState("upload");
  const { configs, setConfigs, updateConfig } = useConfigManager();
  const [images, setImages] = useState<Array<{ url: string; id: string }>>([]);
  const { toast } = useToast();

  const fetchImages = async () => {
    const { data: galleryImages, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching images:', error);
      return;
    }

    if (galleryImages) {
      const formattedImages = galleryImages.map(img => ({
        id: img.id,
        url: supabase.storage.from('gallery').getPublicUrl(img.file_name).data.publicUrl,
      }));
      setImages(formattedImages);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleGallerySettingsSave = async (settings: { carouselEnabled: boolean; carouselInterval: number }) => {
    await updateConfig('gallery_carousel_enabled', settings.carouselEnabled.toString());
    await updateConfig('gallery_carousel_interval', settings.carouselInterval.toString());
    setConfigs(prev => ({
      ...prev,
      gallery_carousel_enabled: settings.carouselEnabled.toString(),
      gallery_carousel_interval: settings.carouselInterval.toString()
    }));
  };

  const handleImageDelete = async (imageUrl: string) => {
    try {
      // Extract filename from URL
      const fileName = imageUrl.split('/').pop();
      if (!fileName) return;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([fileName]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('file_name', fileName);

      if (dbError) throw dbError;

      // Update local state
      setImages(prev => prev.filter(img => img.url !== imageUrl));
      
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
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
            <ImageUploadForm onUploadSuccess={fetchImages} />
          </TabsContent>

          <TabsContent value="manage">
            <ImageGrid 
              images={images}
              onImageDelete={handleImageDelete}
            />
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
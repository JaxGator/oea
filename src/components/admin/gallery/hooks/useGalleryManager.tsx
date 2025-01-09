import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useGalleryManager() {
  const [images, setImages] = useState<Array<{ url: string; id: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [carouselEnabled, setCarouselEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Initializing GalleryManager...');
    fetchImages();
    fetchCarouselConfig();
  }, []);

  const fetchCarouselConfig = async () => {
    try {
      console.log('Fetching carousel configuration...');
      const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'gallery_carousel_enabled')
        .single();

      if (error) {
        console.error('Error fetching carousel config:', error);
        throw error;
      }
      
      console.log('Carousel config fetched:', data?.value);
      setCarouselEnabled(data?.value === 'true');
    } catch (error) {
      console.error('Error fetching carousel config:', error);
      toast({
        title: "Error",
        description: "Failed to fetch carousel configuration",
        variant: "destructive",
      });
    }
  };

  const fetchImages = async () => {
    try {
      console.log('Fetching gallery images...');
      
      // First, get the ordered list of images from the gallery_images table
      const { data: galleryData, error: galleryError } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (galleryError) {
        console.error('Error fetching gallery data:', galleryError);
        throw galleryError;
      }

      console.log('Gallery data fetched:', galleryData);

      if (!galleryData || galleryData.length === 0) {
        console.log('No gallery images found in database');
        setImages([]);
        return;
      }

      // Then get the actual files from storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('gallery')
        .list();

      if (storageError) {
        console.error('Error fetching storage data:', storageError);
        throw storageError;
      }

      console.log('Storage data fetched:', storageData);

      // Map the files to their public URLs, maintaining the order from gallery_images
      const imageUrls = galleryData
        .map(galleryImage => {
          const storageFile = storageData.find(file => file.name === galleryImage.file_name);
          if (!storageFile) {
            console.warn(`File not found in storage: ${galleryImage.file_name}`);
            return null;
          }
          return {
            id: galleryImage.id,
            url: supabase.storage.from('gallery').getPublicUrl(galleryImage.file_name).data.publicUrl
          };
        })
        .filter((image): image is { url: string; id: string } => image !== null);

      console.log(`Found ${imageUrls.length} valid images in gallery`);
      setImages(imageUrls);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Error",
        description: "Failed to fetch images. Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCarouselConfig = async (enabled: boolean) => {
    try {
      console.log('Updating carousel configuration:', enabled);
      const { error } = await supabase
        .from('site_config')
        .upsert({
          key: 'gallery_carousel_enabled',
          value: enabled.toString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        });

      if (error) throw error;

      console.log('Carousel configuration updated successfully');
      setCarouselEnabled(enabled);
      toast({
        title: "Success",
        description: `Gallery carousel ${enabled ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error updating carousel config:', error);
      toast({
        title: "Error",
        description: "Failed to update carousel settings",
        variant: "destructive",
      });
      // Revert the UI state on error
      setCarouselEnabled(!enabled);
    }
  };

  return {
    images,
    isLoading,
    carouselEnabled,
    fetchImages,
    updateCarouselConfig
  };
}
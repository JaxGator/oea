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
      setIsLoading(true);
      console.log('Fetching gallery images...');
      
      // First get the gallery images data
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

      // Transform the data to include public URLs
      const imageUrls = galleryData.map((image) => {
        const { data: urlData } = supabase.storage
          .from('gallery')
          .getPublicUrl(image.file_name);

        console.log('Generated URL for image:', {
          fileName: image.file_name,
          url: urlData.publicUrl
        });

        return {
          id: image.id,
          url: urlData.publicUrl
        };
      });

      console.log('Processed image URLs:', imageUrls);
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
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

      if (error) throw error;
      
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
      
      // First get the list of images from the gallery_images table
      const { data: galleryData, error: dbError } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (dbError) throw dbError;

      console.log('Gallery data fetched:', galleryData);

      if (!galleryData || galleryData.length === 0) {
        console.log('No gallery images found');
        setImages([]);
        return;
      }

      // Transform the data to include public URLs
      const imageUrls = await Promise.all(
        galleryData.map(async (image) => {
          const { data: { publicUrl } } = supabase.storage
            .from('gallery')
            .getPublicUrl(image.file_name);

          console.log('Generated URL for image:', {
            fileName: image.file_name,
            url: publicUrl
          });

          return {
            id: image.id,
            url: publicUrl
          };
        })
      );

      console.log('Final processed image URLs:', imageUrls);
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
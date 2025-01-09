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
      
      // First get the list of files from the storage bucket
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('gallery')
        .list();

      if (storageError) throw storageError;

      console.log('Storage data fetched:', storageData);

      if (!storageData || storageData.length === 0) {
        console.log('No gallery images found in storage');
        setImages([]);
        return;
      }

      // Get the bucket URL
      const { data: { publicUrl: bucketUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl('');

      console.log('Bucket public URL:', bucketUrl);

      // Transform the data to include public URLs
      const imageUrls = storageData
        .filter(file => file.name && !file.name.startsWith('.')) // Filter out hidden files
        .map((file) => {
          const fullUrl = `${bucketUrl}${file.name}`;
          console.log('Generated URL for image:', {
            fileName: file.name,
            url: fullUrl
          });

          return {
            id: file.id || file.name, // Use file name as fallback ID
            url: fullUrl
          };
        });

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
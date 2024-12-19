import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useGalleryImages = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      console.log('Starting gallery initialization from Google Drive...');
      try {
        const { data, error: fetchError } = await supabase.functions.invoke('fetch-drive-images');
        
        if (fetchError) {
          throw new Error(`Failed to fetch images: ${fetchError.message}`);
        }

        if (!data?.files || data.files.length === 0) {
          console.log('No images found in Google Drive folder');
          setImages([]);
          toast.info('No images found in gallery');
          return;
        }

        const imageUrls = data.files.map(file => file.url);
        console.log('Final image URLs:', imageUrls);
        setImages(imageUrls);
        
        if (imageUrls.length > 0) {
          toast.success(`Loaded ${imageUrls.length} images from Google Drive`);
        }
        
        setIsConnected(true);
      } catch (error) {
        console.error('Gallery error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        setIsConnected(false);
        toast.error(`Failed to load gallery: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  return { images, isLoading, error, isConnected };
};
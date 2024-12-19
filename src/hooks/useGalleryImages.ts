import { useState, useEffect } from 'react';
import { supabase, testSupabaseConnection } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useGalleryImages = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      console.log('Starting gallery initialization...');
      try {
        const connected = await testSupabaseConnection();
        setIsConnected(connected);
        console.log('Connection status:', connected);
        
        if (!connected) {
          throw new Error('Unable to connect to Supabase');
        }

        const { data: files, error: listError } = await supabase
          .storage
          .from('gallery')
          .list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
          });

        console.log('Storage list response:', { files, listError });

        if (listError) {
          throw new Error(`Failed to list files: ${listError.message}`);
        }

        if (!files || files.length === 0) {
          console.log('No images found in gallery bucket');
          setImages([]);
          return;
        }

        const imageUrls = files
          .filter(file => {
            const isImage = file.name.match(/\.(jpg|jpeg|png|gif)$/i);
            console.log(`File ${file.name} is image: ${!!isImage}`);
            return isImage;
          })
          .map(file => {
            const { data } = supabase.storage
              .from('gallery')
              .getPublicUrl(file.name);
            console.log(`Generated URL for ${file.name}:`, data.publicUrl);
            return data.publicUrl;
          });

        console.log('Final image URLs:', imageUrls);
        setImages(imageUrls);
        
        if (imageUrls.length > 0) {
          toast.success(`Loaded ${imageUrls.length} images`);
        } else {
          toast.info('No images found in gallery');
        }
      } catch (error) {
        console.error('Gallery error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        toast.error(`Failed to load gallery: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  return { images, isLoading, error, isConnected };
};
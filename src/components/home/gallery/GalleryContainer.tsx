import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useGalleryImages = () => {
  return useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      try {
        const { data: storageData, error: storageError } = await supabase.storage
          .from('gallery')
          .list();

        if (storageError) {
          console.error('Storage error:', storageError);
          throw storageError;
        }

        if (!storageData) {
          console.log('No storage data found');
          return [];
        }

        const imageUrls = storageData
          .filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i))
          .map(file => {
            const { data } = supabase.storage.from('gallery').getPublicUrl(file.name);
            return data.publicUrl;
          });

        return imageUrls;
      } catch (err) {
        console.error('Failed to fetch gallery images:', err);
        toast.error('Failed to load gallery images');
        return [];
      }
    },
    refetchOnWindowFocus: false,
    retry: 1
  });
};

export const useGalleryConfig = () => {
  return useQuery({
    queryKey: ['site-config', 'gallery_carousel_enabled'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('value')
          .eq('key', 'gallery_carousel_enabled')
          .single();
        
        if (error) throw error;
        return data?.value === 'true';
      } catch (err) {
        console.error('Failed to fetch gallery config:', err);
        return false;
      }
    },
    refetchOnWindowFocus: false
  });
};

interface GalleryContainerProps {
  children: (props: {
    images: string[];
    isLoading: boolean;
    error: Error | null;
    isCarouselEnabled: boolean;
  }) => React.ReactNode;
}

export const GalleryContainer: React.FC<GalleryContainerProps> = ({ children }) => {
  const { data: images = [], isLoading, error } = useGalleryImages();
  const { data: isCarouselEnabled = false } = useGalleryConfig();

  return <>{children({ images, isLoading, error: error as Error | null, isCarouselEnabled })}</>;
};
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GalleryData {
  images: string[];
  isLoading: boolean;
  error: Error | null;
  isCarouselEnabled?: boolean;
}

interface GalleryContainerProps {
  children: (data: GalleryData) => React.ReactNode;
}

export const GalleryContainer: React.FC<GalleryContainerProps> = ({ children }) => {
  const { data: config } = useQuery({
    queryKey: ['site-config', 'gallery_carousel_enabled'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'gallery_carousel_enabled')
        .single();
      
      if (error) throw error;
      return data?.value === 'true';
    },
    refetchOnWindowFocus: false
  });

  const { data: galleryImages = [], isLoading, error } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) throw error;

        if (!data) return [];

        // Transform the data to return just the file_name strings
        return data.map(image => image.file_name);
      } catch (err) {
        console.error('Failed to fetch gallery images:', err);
        toast.error('Failed to load gallery images');
        throw err;
      }
    },
    refetchOnWindowFocus: false,
    retry: 1
  });

  return <>{children({ 
    images: galleryImages, 
    isLoading, 
    error, 
    isCarouselEnabled: config 
  })}</>;
};
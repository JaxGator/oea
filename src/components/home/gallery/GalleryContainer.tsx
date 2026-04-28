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
        
        // First get the ordered list of images from gallery_images table
        const { data: galleryData, error: dbError } = await supabase
          .from('gallery_images')
          .select('*')
          .order('display_order', { ascending: true });

        if (dbError) {
          console.error('Error fetching gallery data:', dbError);
          throw dbError;
        }


        if (!galleryData || galleryData.length === 0) {
          return [];
        }

        // Transform the data to return the full public URLs for the images
        const imageUrls = galleryData.map(image => {
          const { data: urlData } = supabase.storage
            .from('gallery')
            .getPublicUrl(image.file_name);
            
          return urlData.publicUrl;
        });

        return imageUrls;
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
    error: error as Error | null,
    isCarouselEnabled: config 
  })}</>;
};
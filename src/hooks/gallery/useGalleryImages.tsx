import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ImageType } from '@/components/admin/gallery/types/gallery';
import { toast } from '@/hooks/use-toast';

export function useGalleryImages() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .not('file_name', 'like', 'event-pics/%')
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      const processedImages = data.map(image => {
        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(image.file_name);

        return {
          id: image.id,
          url: publicUrl,
          fileName: image.file_name,
          displayOrder: image.display_order
        };
      });

      setImages(processedImages);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast({
        title: "Error",
        description: "Failed to load gallery images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return { images, isLoading, fetchImages };
}
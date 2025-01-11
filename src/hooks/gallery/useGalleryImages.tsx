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
      
      const { data: galleryData, error: dbError } = await supabase
        .from('gallery_images')
        .select('*')
        .not('file_name', 'like', 'event-pics/%')
        .order('display_order', { ascending: true });

      if (dbError) {
        throw dbError;
      }

      const processedImages = await Promise.all(
        galleryData.map(async (image) => {
          try {
            // First check if the file exists in storage
            const { data: fileData, error: fileError } = await supabase
              .storage
              .from('gallery')
              .list('', {
                search: image.file_name
              });

            // Skip if file doesn't exist in storage
            if (fileError || !fileData || fileData.length === 0) {
              console.log('File not found in storage:', image.file_name);
              return null;
            }

            const { data: { publicUrl } } = supabase.storage
              .from('gallery')
              .getPublicUrl(image.file_name);

            // Verify the URL is valid
            const urlCheck = await fetch(publicUrl, { method: 'HEAD' })
              .catch(() => null);

            if (!urlCheck?.ok) {
              console.log('Invalid URL:', publicUrl);
              return null;
            }

            return {
              id: image.id,
              url: publicUrl,
              fileName: image.file_name,
              displayOrder: image.display_order
            };
          } catch (error) {
            console.error('Error processing image:', image.file_name, error);
            return null;
          }
        })
      );

      const validImages = processedImages.filter((img): img is ImageType => img !== null);
      
      console.log('Processed gallery images:', {
        total: galleryData.length,
        valid: validImages.length,
        images: validImages
      });

      setImages(validImages);
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
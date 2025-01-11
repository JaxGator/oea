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
      
      // Fetch images from the database
      const { data: galleryData, error: dbError } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (dbError) {
        throw dbError;
      }

      // Process and validate each image
      const validImages = await Promise.all(
        galleryData.map(async (image) => {
          try {
            const { data: { publicUrl } } = supabase.storage
              .from('gallery')
              .getPublicUrl(image.file_name);

            // Return the image data only if we can generate a public URL
            if (publicUrl) {
              return {
                id: image.id,
                url: publicUrl,
                fileName: image.file_name,
                displayOrder: image.display_order
              };
            }
            return null;
          } catch (error) {
            console.error('Error processing image:', image.file_name, error);
            return null;
          }
        })
      );

      // Filter out any null values (invalid images)
      const filteredImages = validImages.filter((img): img is ImageType => img !== null);
      
      console.log('Processed gallery images:', {
        total: galleryData.length,
        valid: filteredImages.length,
        images: filteredImages
      });

      setImages(filteredImages);
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
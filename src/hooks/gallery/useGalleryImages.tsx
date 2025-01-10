import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useGalleryImages() {
  const [images, setImages] = useState<Array<{ url: string; id: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching gallery images...');
      
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

      const imageUrls = galleryData.map((image) => {
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

  useEffect(() => {
    fetchImages();
  }, []);

  return { images, isLoading, fetchImages };
}
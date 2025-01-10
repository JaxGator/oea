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

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      console.log('Raw gallery data:', galleryData);

      if (!galleryData || galleryData.length === 0) {
        console.log('No gallery images found in database');
        setImages([]);
        return;
      }

      const imageUrls = await Promise.all(galleryData.map(async (image) => {
        // Log the file name being processed
        console.log('Processing file:', image.file_name);

        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('gallery')
          .getPublicUrl(image.file_name);

        // Validate the URL
        if (!urlData?.publicUrl) {
          console.error('Failed to generate public URL for:', image.file_name);
          return null;
        }

        // Log the generated URL
        console.log('Generated URL:', {
          fileName: image.file_name,
          url: urlData.publicUrl
        });

        // Verify the URL is accessible
        try {
          const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
          if (!response.ok) {
            console.error('URL not accessible:', urlData.publicUrl);
            return null;
          }
        } catch (error) {
          console.error('Error checking URL accessibility:', error);
          return null;
        }

        return {
          id: image.id,
          url: urlData.publicUrl
        };
      }));

      // Filter out any null values from failed URL generations
      const validImages = imageUrls.filter((img): img is { id: string; url: string } => img !== null);
      
      console.log('Final processed image URLs:', validImages);
      setImages(validImages);

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
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useGalleryImageValidation() {
  const [validatedUrls, setValidatedUrls] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(true);

  const validateImageUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Image validation error:', error);
      return false;
    }
  };

  const validateAndFetchImages = async () => {
    try {
      console.log('Fetching gallery images for validation...');
      
      const { data: galleryData, error: dbError } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (dbError) throw dbError;

      if (!galleryData || galleryData.length === 0) {
        setValidatedUrls([]);
        setIsValidating(false);
        return;
      }

      const urls = await Promise.all(
        galleryData.map(async (image) => {
          const { data: urlData } = supabase.storage
            .from('gallery')
            .getPublicUrl(image.file_name);

          if (!urlData?.publicUrl) {
            console.error('Failed to generate URL for:', image.file_name);
            return null;
          }

          const isValid = await validateImageUrl(urlData.publicUrl);
          
          if (!isValid) {
            console.error('Invalid image URL:', urlData.publicUrl);
            return null;
          }

          return urlData.publicUrl;
        })
      );

      const validUrls = urls.filter((url): url is string => url !== null);
      console.log('Valid gallery URLs:', validUrls);
      setValidatedUrls(validUrls);
    } catch (error) {
      console.error('Gallery validation error:', error);
      toast({
        title: "Error",
        description: "Failed to load gallery images. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    validateAndFetchImages();
  }, []);

  return {
    validatedUrls,
    isValidating,
    refetch: validateAndFetchImages
  };
}
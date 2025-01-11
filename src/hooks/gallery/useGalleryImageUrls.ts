import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ImageUrlMap {
  [key: string]: string;
}

export function useGalleryImageUrls(images: Array<{ url: string; id: string }>) {
  const [validUrls, setValidUrls] = useState<ImageUrlMap>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateAndGetPublicUrls = async () => {
      setIsLoading(true);
      const urlMap: ImageUrlMap = {};
      
      for (const image of images) {
        try {
          // Extract the file name from the URL or use the full URL if it's not a Supabase URL
          let fileName = image.url;
          if (image.url.includes('supabase.co')) {
            const urlParts = image.url.split('/');
            fileName = urlParts[urlParts.length - 1].split('?')[0];
          }

          // Get a fresh public URL from Supabase
          const { data } = supabase.storage
            .from('gallery')
            .getPublicUrl(fileName);

          if (data?.publicUrl) {
            urlMap[image.id] = data.publicUrl;
          } else {
            console.warn('No public URL generated for:', fileName);
          }
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
      
      setValidUrls(urlMap);
      setIsLoading(false);
    };

    if (images.length > 0) {
      validateAndGetPublicUrls();
    } else {
      setIsLoading(false);
    }
  }, [images]);

  return { validUrls, isLoading };
}
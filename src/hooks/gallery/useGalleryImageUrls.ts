import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
          let fileName = image.url;
          
          if (image.url.includes('supabase.co')) {
            const urlParts = image.url.split('/');
            fileName = urlParts[urlParts.length - 1].split('?')[0];
          } else if (image.url.includes('/')) {
            fileName = image.url.split('/').pop() || '';
          }

          if (!fileName) {
            console.error('Invalid file name:', image.url);
            continue;
          }

          const { data } = supabase.storage
            .from('gallery')
            .getPublicUrl(fileName);

          if (data?.publicUrl) {
            // Validate the URL exists
            const response = await fetch(data.publicUrl, { method: 'HEAD' });
            if (response.ok) {
              urlMap[image.id] = data.publicUrl;
            } else {
              console.warn('Invalid image URL:', data.publicUrl);
            }
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
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useSession } from '@/hooks/auth/useSession';

export function useImageValidation(imageUrl: string, imageId: string) {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSession();

  useEffect(() => {
    const validateImage = async () => {
      try {
        if (!imageUrl) {
          setIsValid(false);
          return;
        }

        let fileName = imageUrl;
        if (imageUrl.includes('supabase.co')) {
          const urlParts = imageUrl.split('/');
          fileName = urlParts[urlParts.length - 1].split('?')[0];
        } else if (imageUrl.includes('/')) {
          fileName = imageUrl.split('/').pop() || '';
        }

        if (!fileName) {
          console.error('Invalid file name:', imageUrl);
          setIsValid(false);
          return;
        }

        const { data } = supabase.storage
          .from('gallery')
          .getPublicUrl(fileName);

        setIsValid(!!data.publicUrl);
      } catch (error) {
        console.error('Image validation error:', error);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateImage();
  }, [imageUrl]);

  return { isValid, isLoading };
}
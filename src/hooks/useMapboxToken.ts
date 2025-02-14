
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseMapboxTokenReturn {
  mapToken: string;
  isLoading: boolean;
  error: Error | null;
}

export const useMapboxToken = (): UseMapboxTokenReturn => {
  const [mapToken, setMapToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout;

    const fetchMapboxToken = async () => {
      try {
        console.log('Fetching Mapbox token...');
        const { data, error: fetchError } = await supabase.functions.invoke('get-mapbox-token');
        
        if (fetchError) {
          console.error('Function error:', fetchError);
          throw new Error(fetchError.message);
        }

        if (!data?.token) {
          throw new Error('No token returned from function');
        }

        if (!isMounted) return;

        console.log('Token fetched successfully');
        setMapToken(data.token);
        setError(null);
        setRetryCount(0);
      } catch (err) {
        console.error('Error fetching Mapbox token:', err);
        if (!isMounted) return;

        setError(err as Error);
        
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying token fetch in ${RETRY_DELAY}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
          retryTimeout = setTimeout(() => {
            if (isMounted) {
              setRetryCount(prev => prev + 1);
            }
          }, RETRY_DELAY);
        } else {
          toast.error('Failed to load map configuration. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMapboxToken();

    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [retryCount]);

  return { mapToken, isLoading, error };
};


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

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        console.log('Fetching Mapbox token...');
        const { data, error: fetchError } = await supabase.functions.invoke('get-mapbox-token', {
          method: 'GET'
        });
        
        if (fetchError) {
          console.error('Error fetching Mapbox token:', fetchError);
          setError(fetchError);
          toast.error('Failed to load map. Please try again later.');
          return;
        }

        if (!data?.token) {
          const err = new Error('No token returned from function');
          console.error(err);
          setError(err);
          toast.error('Failed to load map configuration');
          return;
        }

        console.log('Successfully retrieved Mapbox token');
        setMapToken(data.token);
        setError(null);
      } catch (err) {
        console.error('Error in fetchMapboxToken:', err);
        setError(err as Error);
        toast.error('Failed to initialize map');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMapboxToken();
  }, []);

  return { mapToken, isLoading, error };
};

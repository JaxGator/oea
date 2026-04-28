import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseGoogleMapsTokenReturn {
  mapKey: string;
  isLoading: boolean;
  error: Error | null;
}

export const useGoogleMapsToken = (): UseGoogleMapsTokenReturn => {
  const [mapKey, setMapKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGoogleMapsKey = async () => {
      try {
        const { data, error: fetchError } = await supabase.functions.invoke('get-google-maps-token');
        
        if (fetchError) {
          console.error('Error fetching Google Maps token:', fetchError);
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

        setMapKey(data.token);
        setError(null);
      } catch (err) {
        console.error('Error in fetchGoogleMapsKey:', err);
        setError(err as Error);
        toast.error('Failed to initialize map');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoogleMapsKey();
  }, []);

  return { mapKey, isLoading, error };
};
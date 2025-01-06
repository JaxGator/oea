import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useGoogleMapsToken = () => {
  const [mapKey, setMapKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGoogleMapsKey = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.functions.invoke('get-google-maps-token', {
          method: 'POST',
        });

        if (error) {
          console.error('Supabase function error:', error);
          toast.error('Failed to load map configuration');
          setError(error);
          return;
        }

        if (!data?.token) {
          const err = new Error('No Google Maps API key returned');
          console.error(err);
          toast.error('Failed to load map configuration');
          setError(err);
          return;
        }

        console.log('Successfully retrieved Google Maps token');
        setMapKey(data.token);
      } catch (err) {
        console.error('Error fetching Google Maps token:', err);
        toast.error('Failed to initialize map');
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoogleMapsKey();
  }, []);

  return { mapKey, isLoading, error };
};
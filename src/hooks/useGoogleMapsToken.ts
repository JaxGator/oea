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
        const { data, error } = await supabase.functions.invoke('get-google-maps-token');
        if (error) {
          console.error('Error fetching Google Maps token:', error);
          toast.error('Failed to load map. Please try again later.');
          setError(error);
          return;
        }
        if (!data?.token) {
          const err = new Error('No token returned from function');
          console.error(err);
          toast.error('Failed to load map configuration');
          setError(err);
          return;
        }
        setMapKey(data.token);
      } catch (err) {
        console.error('Error in fetchGoogleMapsKey:', err);
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
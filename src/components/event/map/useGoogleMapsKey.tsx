import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useGoogleMapsKey(isEnabled: boolean) {
  const [googleMapsKey, setGoogleMapsKey] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error: functionError } = await supabase.functions.invoke('get-google-maps-token');
        
        if (functionError) {
          console.error('Error fetching Google Maps token:', functionError);
          throw new Error('Failed to load map configuration. Please try again later.');
        }
        
        if (!data?.token) {
          throw new Error('Invalid map configuration received. Please contact support.');
        }

        setGoogleMapsKey(data.token);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load map configuration';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    };

    if (isEnabled) {
      fetchApiKey();
    }
  }, [isEnabled]);

  return { googleMapsKey, error };
}
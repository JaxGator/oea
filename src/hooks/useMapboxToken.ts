
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseMapboxTokenReturn {
  mapToken: string;
  isLoading: boolean;
  error: Error | null;
}

const TOKEN_CACHE_KEY = 'mapbox_token_cache';
const TOKEN_CACHE_DURATION = 3600000; // 1 hour in milliseconds

interface TokenCache {
  token: string;
  timestamp: number;
}

const getTokenFromCache = (): string | null => {
  const cached = localStorage.getItem(TOKEN_CACHE_KEY);
  if (!cached) return null;

  try {
    const { token, timestamp }: TokenCache = JSON.parse(cached);
    if (Date.now() - timestamp < TOKEN_CACHE_DURATION) {
      return token;
    }
    localStorage.removeItem(TOKEN_CACHE_KEY);
  } catch (error) {
    console.error('Error parsing cached token:', error);
    localStorage.removeItem(TOKEN_CACHE_KEY);
  }
  return null;
};

const setTokenInCache = (token: string) => {
  const cacheData: TokenCache = {
    token,
    timestamp: Date.now()
  };
  localStorage.setItem(TOKEN_CACHE_KEY, JSON.stringify(cacheData));
};

export const useMapboxToken = (): UseMapboxTokenReturn => {
  const [mapToken, setMapToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout;

    const fetchMapboxToken = async () => {
      try {
        // Check cache first
        const cachedToken = getTokenFromCache();
        if (cachedToken) {
          console.log('Using cached Mapbox token');
          if (isMounted) {
            setMapToken(cachedToken);
            setIsLoading(false);
            setError(null);
          }
          return;
        }

        console.log('Fetching fresh Mapbox token...');
        const { data, error: fetchError } = await supabase.functions.invoke('get-mapbox-token', {
          method: 'GET'
        });
        
        if (!isMounted) return;

        if (fetchError) {
          throw fetchError;
        }

        if (!data?.token) {
          throw new Error('No token returned from function');
        }

        setTokenInCache(data.token);
        setMapToken(data.token);
        setError(null);
        setRetryCount(0);
      } catch (err) {
        console.error('Error in fetchMapboxToken:', err);
        if (!isMounted) return;

        setError(err as Error);
        
        // Implement exponential backoff for retries
        if (retryCount < 3) {
          const nextRetry = Math.min(1000 * Math.pow(2, retryCount), 8000);
          console.log(`Retrying token fetch in ${nextRetry}ms...`);
          retryTimeout = setTimeout(() => {
            if (isMounted) {
              setRetryCount(prev => prev + 1);
              fetchMapboxToken();
            }
          }, nextRetry);
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

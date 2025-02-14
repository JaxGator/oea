
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
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

interface TokenCache {
  token: string;
  timestamp: number;
}

const getTokenFromCache = (): string | null => {
  try {
    const cached = localStorage.getItem(TOKEN_CACHE_KEY);
    if (!cached) return null;

    const { token, timestamp }: TokenCache = JSON.parse(cached);
    if (Date.now() - timestamp < TOKEN_CACHE_DURATION) {
      return token;
    }
    localStorage.removeItem(TOKEN_CACHE_KEY);
  } catch (error) {
    console.error('Error reading token from cache:', error);
    localStorage.removeItem(TOKEN_CACHE_KEY);
  }
  return null;
};

const setTokenInCache = (token: string) => {
  try {
    const cacheData: TokenCache = {
      token,
      timestamp: Date.now()
    };
    localStorage.setItem(TOKEN_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching token:', error);
  }
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
        const { data, error: fetchError } = await supabase.functions.invoke<{ token: string }>('get-mapbox-token', {
          method: 'GET'
        });

        if (fetchError) {
          console.error('Function error:', fetchError);
          throw new Error(fetchError.message);
        }

        if (!data?.token) {
          throw new Error('No token returned from function');
        }

        if (!isMounted) return;

        console.log('Token fetched successfully');
        setTokenInCache(data.token);
        setMapToken(data.token);
        setError(null);
        setRetryCount(0);
      } catch (err) {
        console.error('Error fetching Mapbox token:', err);
        if (!isMounted) return;

        setError(err as Error);
        
        if (retryCount < MAX_RETRIES) {
          const nextRetry = Math.min(RETRY_DELAY * Math.pow(2, retryCount), 8000);
          console.log(`Retrying token fetch in ${nextRetry}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
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

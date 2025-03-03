
import { useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isProtectedRoute } from "@/utils/routeConfig";
import { clearSessionData, isRefreshTokenError, refreshSession, getSession } from "@/utils/sessionUtils";
import { AuthError } from '@supabase/supabase-js';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export const useSessionManager = (queryClient: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const retryCount = useRef(0);
  const refreshTimerRef = useRef<NodeJS.Timeout>();

  const handleSessionError = useCallback(async (error: AuthError) => {
    console.error('Session error:', error);
    
    if (error.message.includes('Invalid Refresh Token') || error.message.includes('JWT expired')) {
      await clearSessionData();
      
      if (!isRefreshTokenError(error)) {
        toast({
          title: "Session Error",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive",
        });
      }
      
      if (isProtectedRoute(location.pathname)) {
        navigate('/auth', { state: { from: location } });
      }
    }
  }, [navigate, location, toast]);

  const checkSession = useCallback(async () => {
    try {
      console.log('Checking session...');
      const session = await getSession();

      retryCount.current = 0;

      if (!session) {
        console.log('No active session found');
        if (isProtectedRoute(location.pathname)) {
          console.log('Protected route - redirecting to auth');
          await clearSessionData();
          navigate('/auth', { state: { from: location } });
        }
        return;
      }

      const expiresAt = session?.expires_at || 0;
      const isExpiringSoon = (expiresAt * 1000) - Date.now() < 5 * 60 * 1000;

      if (isExpiringSoon) {
        console.log('Token expiring soon, attempting refresh...');
        try {
          const refreshedSession = await refreshSession();
          if (!refreshedSession) {
            console.log('Session refresh returned no session');
            await clearSessionData();
            if (isProtectedRoute(location.pathname)) {
              navigate('/auth', { state: { from: location } });
            }
            return;
          }
          console.log('Session refreshed successfully');
        } catch (refreshErr) {
          await handleSessionError(refreshErr as AuthError);
        }
      }
    } catch (err) {
      console.error('Session check failed:', err);
      if (retryCount.current < MAX_RETRIES) {
        retryCount.current++;
        console.log(`Retrying after error (${retryCount.current}/${MAX_RETRIES})...`);
        setTimeout(checkSession, RETRY_DELAY);
        return;
      }
      await handleSessionError(err as AuthError);
    }
  }, [navigate, location.pathname, handleSessionError]);

  useEffect(() => {
    let mounted = true;

    const setupAuthListener = () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        
        switch (event) {
          case 'SIGNED_OUT':
            console.log('User signed out, clearing data');
            await clearSessionData();
            if (isProtectedRoute(location.pathname)) {
              navigate('/auth', { state: { from: location } });
            }
            break;
            
          case 'SIGNED_IN':
            console.log('User signed in:', session?.user?.id);
            if (location.pathname === '/auth') {
              navigate('/');
            }
            break;
            
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed successfully');
            break;

          case 'USER_UPDATED':
            await checkSession();
            break;
        }
      });

      return subscription;
    };

    // Initial session check
    checkSession();

    // Set up auth listener
    const subscription = setupAuthListener();

    // We're removing the visibility change handler and periodic refresh timer
    // to prevent automatic refreshes when switching tabs

    return () => {
      mounted = false;
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
      subscription.unsubscribe();
    };
  }, [checkSession, navigate, location.pathname, queryClient]);
};

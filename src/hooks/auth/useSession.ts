import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface SessionState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

export function useSession() {
  const [state, setState] = useState<SessionState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setState({ user: null, isLoading: false, error });
        return;
      }
      
      console.log('Initial session state:', {
        hasSession: !!session,
        user: session?.user,
        timestamp: new Date().toISOString()
      });
      
      setState({ user: session?.user ?? null, isLoading: false, error: null });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', {
          event,
          hasSession: !!session,
          user: session?.user,
          timestamp: new Date().toISOString()
        });
        
        setState({
          user: session?.user ?? null,
          isLoading: false,
          error: null,
        });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
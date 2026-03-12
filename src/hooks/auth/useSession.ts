
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types/auth';

interface SessionState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
}

export function useSession() {
  const [state, setState] = useState<SessionState>({
    user: null,
    profile: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          if (mounted) {
            setState(prev => ({ ...prev, isLoading: false, error: sessionError }));
          }
          return;
        }

        if (!session) {
          console.log('No active session');
          if (mounted) {
            setState(prev => ({ ...prev, isLoading: false }));
          }
          return;
        }

        console.log('Session found:', session.user.id);

        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            if (mounted) {
              setState({
                user: session.user,
                profile: null,
                isLoading: false,
                error: profileError
              });
            }
            return;
          }

          if (mounted) {
            setState({
              user: session.user,
              profile: profile as Profile,
              isLoading: false,
              error: null
            });
          }
        }
      } catch (error) {
        console.error('Session initialization error:', error);
        if (mounted) {
          setState(prev => ({ ...prev, isLoading: false, error: error as Error }));
        }
      }
    };

    initializeSession();

    // No onAuthStateChange here — SessionManager handles all auth state
    // changes centrally and invalidates queries, which triggers refetches.

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}

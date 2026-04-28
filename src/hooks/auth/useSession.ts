
import { useEffect, useState, useCallback } from 'react';
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

  const fetchProfile = useCallback(async (userId: string) => {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return { profile: null, error: profileError };
    }
    return { profile: profile as Profile, error: null };
  }, []);

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
          if (mounted) {
            setState(prev => ({ ...prev, isLoading: false }));
          }
          return;
        }

        if (session?.user) {
          const { profile, error } = await fetchProfile(session.user.id);
          if (mounted) {
            setState({
              user: session.user,
              profile,
              isLoading: false,
              error: error as Error | null
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !session) {
          setState({ user: null, profile: null, isLoading: false, error: null });
          return;
        }

        if (session?.user) {
          const { profile, error } = await fetchProfile(session.user.id);
          if (mounted) {
            setState({
              user: session.user,
              profile,
              isLoading: false,
              error: error as Error | null
            });
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  return state;
}

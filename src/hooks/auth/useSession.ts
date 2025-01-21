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
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setState({ user: null, profile: null, isLoading: false, error });
        return;
      }
      
      console.log('Initial session state:', {
        hasSession: !!session,
        user: session?.user,
        timestamp: new Date().toISOString()
      });

      if (session?.user) {
        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setState({ 
            user: session.user, 
            profile: null, 
            isLoading: false, 
            error: profileError 
          });
          return;
        }

        setState({ 
          user: session.user, 
          profile, 
          isLoading: false, 
          error: null 
        });
      } else {
        setState({ 
          user: null, 
          profile: null, 
          isLoading: false, 
          error: null 
        });
      }
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
        
        if (session?.user) {
          // Fetch profile data
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            setState({ 
              user: session.user, 
              profile: null, 
              isLoading: false, 
              error: profileError 
            });
            return;
          }

          setState({
            user: session.user,
            profile,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            profile: null,
            isLoading: false,
            error: null,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
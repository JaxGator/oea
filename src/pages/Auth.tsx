
import { useEffect } from 'react';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { toast } from 'sonner';

export default function Auth() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (session) {
      const from = location.state?.from?.pathname || '/';
      console.log('Session exists, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [session, navigate, location]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN') {
        toast.success('Successfully signed in');
      } else if (event === 'SIGNED_OUT') {
        toast.info('Signed out');
      } else if (event === 'USER_UPDATED') {
        toast.success('Profile updated');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8'
                  }
                }
              }
            }}
            theme="default"
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
}

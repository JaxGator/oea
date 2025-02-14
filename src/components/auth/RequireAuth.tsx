
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingScreen } from '@/components/ui/loading-screen';

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      if (!session) {
        console.log('No active session, redirecting to auth');
        
        // Only show toast if not already on auth page
        if (location.pathname !== '/auth') {
          toast({
            title: "Authentication Required",
            description: "Please sign in to continue",
            variant: "destructive",
          });
        }
        
        navigate('/auth', { 
          state: { from: location.pathname === '/auth' ? '/' : location },
          replace: true 
        });
      }
    };

    checkSession();
  }, [session, navigate, location, toast]);

  if (!session) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  return <>{children}</>;
}

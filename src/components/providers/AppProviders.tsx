import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AppProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export function AppProviders({ children }: AppProvidersProps) {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          // Clear any stale data if there's a session error
          queryClient.clear();
          localStorage.clear(); // Clear all local storage to ensure no stale tokens
          if (!location.pathname.includes('/auth')) {
            navigate('/auth');
          }
        }

        if (!session && !location.pathname.includes('/auth')) {
          console.log('No active session, redirecting to auth');
          navigate('/auth');
        }
      } catch (err) {
        console.error('Session check failed:', err);
        if (!location.pathname.includes('/auth')) {
          navigate('/auth');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT') {
        // Clear any auth-related state
        queryClient.clear();
        localStorage.clear(); // Clear all local storage
        if (!location.pathname.includes('/auth')) {
          navigate('/auth');
        }
        toast({
          title: "Signed out",
          description: "You have been signed out successfully",
        });
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }

      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.id);
        if (location.pathname.includes('/auth')) {
          navigate('/');
        }
        toast({
          title: "Signed in",
          description: "Welcome back!",
        });
      }
    });

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider 
        supabaseClient={supabase}
        initialSession={null}
      >
        <TooltipProvider>
          {children}
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}
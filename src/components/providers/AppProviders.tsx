
import { ReactNode, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { SessionManager } from "@/components/auth/SessionManager";

interface AppProvidersProps {
  children: ReactNode;
}

// Create a persistent query client to maintain data between renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Add proper error handling
      onError: (error) => {
        console.error("Query error:", error);
      }
    },
  },
});

export function AppProviders({ children }: AppProvidersProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [initialSession, setInitialSession] = useState(null);

  // Get initial session on component mount
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting initial session:", error);
        } else {
          console.log("Initial session loaded successfully:", !!session);
          setInitialSession(session);
        }
      } catch (err) {
        console.error("Failed to get initial session:", err);
      } finally {
        setTimeout(() => setIsLoading(false), 100);
      }
    };

    getInitialSession();
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Initializing application..." />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider 
        supabaseClient={supabase}
        initialSession={initialSession}
      >
        <TooltipProvider>
          <SessionManager queryClient={queryClient}>
            {children}
          </SessionManager>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

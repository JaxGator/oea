import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

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
  const [initialSession, setInitialSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setInitialSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setInitialSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider 
        supabaseClient={supabase}
        initialSession={initialSession}
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
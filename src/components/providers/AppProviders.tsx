
import { ReactNode, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { SessionManager } from "@/components/auth/SessionManager";
import { Router } from "react-router-dom";

interface AppProvidersProps {
  children: ReactNode;
  router: any;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export function AppProviders({ children, router }: AppProvidersProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial load to prevent flash
  useState(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  });

  if (isLoading) {
    return <LoadingScreen message="Initializing application..." />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider 
        supabaseClient={supabase}
        initialSession={null}
      >
        <TooltipProvider>
          <RouterProvider router={router}>
            <SessionManager queryClient={queryClient}>
              {children}
            </SessionManager>
          </RouterProvider>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

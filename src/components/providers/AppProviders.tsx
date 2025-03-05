
import React, { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "./NotificationProvider";
import { StreamChatProvider } from "@/components/messages/StreamChatProvider";
import { PermissionProvider } from "@/hooks/auth/PermissionProvider";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { toast } from "sonner";

interface AppProvidersProps {
  children: React.ReactNode;
}

// Create a fresh query client instance each time to avoid stale state issues
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false, // Disable retries to prevent infinite loading states
      gcTime: 1000 * 60 * 5, // 5 minutes - reduced from 24 hours
      staleTime: 1000 * 60, // 1 minute - reduced from 5 minutes
    },
  },
});

export function AppProviders({ children }: AppProvidersProps) {
  console.log('Rendering AppProviders...');
  
  useEffect(() => {
    console.log('AppProviders mounted');
    
    // Simpler error handling approach
    const unsubscribeQuery = queryClient.getQueryCache().subscribe(() => {
      const queries = queryClient.getQueryCache().findAll({ predicate: query => query.state.status === 'error' });
      if (queries.length > 0) {
        console.error('Query errors detected:', queries.map(q => q.state.error));
        toast.error('Failed to load data. Please try refreshing.');
      }
    });
    
    const unsubscribeMutation = queryClient.getMutationCache().subscribe(() => {
      const mutations = queryClient.getMutationCache().getAll().filter(mutation => mutation.state.status === 'error');
      if (mutations.length > 0) {
        console.error('Mutation errors detected:', mutations.map(m => m.state.error));
        toast.error('An operation failed. Please try again.');
      }
    });
    
    return () => {
      console.log('AppProviders unmounted - cleaning up subscriptions');
      unsubscribeQuery();
      unsubscribeMutation();
    };
  }, []);
  
  // Simplify provider nesting to reduce potential points of failure
  return (
    <ErrorBoundary 
      fallback={<div className="p-4 text-red-500">Application failed to load. Please refresh the page.</div>}
      onError={(error) => console.error("Root error boundary caught:", error)}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PermissionProvider>
            <NotificationProvider>
              <StreamChatProvider>
                {children}
              </StreamChatProvider>
            </NotificationProvider>
          </PermissionProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}


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

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      onError: (error) => {
        console.error('Global mutation error:', error);
        toast.error('An operation failed. Please try again.');
      }
    }
  },
});

export function AppProviders({ children }: AppProvidersProps) {
  console.log('Rendering AppProviders...');
  
  useEffect(() => {
    console.log('AppProviders mounted');
    
    // Set up global error handling for query cache
    const unsubscribeQuery = queryClient.getQueryCache().subscribe(event => {
      if (event.type === 'observerResultsUpdated' && event.query.state.status === 'error') {
        console.error('Query error:', event.query.state.error);
        toast.error('Failed to load data. Please try refreshing.');
      }
    });
    
    // Set up global error handling for mutation cache
    const unsubscribeMutation = queryClient.getMutationCache().subscribe(event => {
      if (event.type === 'observerAdded' && event.mutation.state.status === 'error') {
        console.error('Mutation error:', event.mutation.state.error);
        toast.error('An operation failed. Please try again.');
      }
    });
    
    return () => {
      console.log('AppProviders unmounted');
      unsubscribeQuery();
      unsubscribeMutation();
    };
  }, []);
  
  // Wrap each provider in its own error boundary
  return (
    <ErrorBoundary 
      fallback={<div className="p-4 text-red-500">Query client provider error</div>}
      onError={(error) => console.error("QueryClientProvider error:", error)}
    >
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary 
          fallback={<div className="p-4 text-red-500">Theme provider error</div>}
          onError={(error) => console.error("ThemeProvider error:", error)}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ErrorBoundary 
              fallback={<div className="p-4 text-red-500">Permission provider error</div>}
              onError={(error) => console.error("PermissionProvider error:", error)}
            >
              <PermissionProvider>
                <ErrorBoundary 
                  fallback={<div className="p-4 text-red-500">Notification provider error</div>}
                  onError={(error) => console.error("NotificationProvider error:", error)}
                >
                  <NotificationProvider>
                    <ErrorBoundary 
                      fallback={<div className="p-4 text-red-500">Chat provider error</div>}
                      onError={(error) => console.error("StreamChatProvider error:", error)}
                    >
                      <StreamChatProvider>
                        {children}
                      </StreamChatProvider>
                    </ErrorBoundary>
                  </NotificationProvider>
                </ErrorBoundary>
              </PermissionProvider>
            </ErrorBoundary>
          </ThemeProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}


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

// Create a client with enhanced error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      onError: (error) => {
        console.error('Query error:', error);
      }
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error);
        toast.error('An operation failed. Please try again.');
      }
    }
  },
});

export function AppProviders({ children }: AppProvidersProps) {
  console.log('Rendering AppProviders...');
  
  useEffect(() => {
    console.log('AppProviders mounted');
    return () => {
      console.log('AppProviders unmounted');
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

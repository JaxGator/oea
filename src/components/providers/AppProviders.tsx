
import React from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "./NotificationProvider";
import { StreamChatProvider } from "@/components/messages/StreamChatProvider";
import { PermissionProvider } from "@/hooks/auth/usePermissionStore";

interface AppProvidersProps {
  children: React.ReactNode;
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <PermissionProvider>
          <NotificationProvider>
            <StreamChatProvider>{children}</StreamChatProvider>
          </NotificationProvider>
        </PermissionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

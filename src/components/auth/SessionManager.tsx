import { ReactNode } from "react";
import { QueryClient } from "@tanstack/react-query";
import { useSessionManager } from "@/hooks/useSessionManager";

interface SessionManagerProps {
  children: ReactNode;
  queryClient: QueryClient;
}

export function SessionManager({ children, queryClient }: SessionManagerProps) {
  useSessionManager(queryClient);
  return <>{children}</>;
}
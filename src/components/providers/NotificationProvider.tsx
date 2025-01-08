import React, { createContext, useContext, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

type NotificationType = "info" | "success" | "error" | "warning";

interface NotificationContextType {
  notify: (type: NotificationType, title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();

  const notify = useCallback((type: NotificationType, title: string, message?: string) => {
    const variant = type === "error" ? "destructive" : "default";
    toast({
      title,
      description: message,
      variant,
    });
  }, [toast]);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
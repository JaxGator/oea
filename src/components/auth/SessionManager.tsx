
import { ReactNode, useEffect, useState, useRef } from "react";
import { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { isProtectedRoute } from "@/utils/routeConfig";

interface SessionManagerProps {
  children: ReactNode;
  queryClient: QueryClient;
}

export function SessionManager({ children, queryClient }: SessionManagerProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  // Use refs so the effect callback always sees current values without re-running
  const navigateRef = useRef(navigate);
  const locationRef = useRef(location);
  navigateRef.current = navigate;
  locationRef.current = location;

  useEffect(() => {
    let mounted = true;

    // 1. One-time session check
    const init = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) console.error("Session check error:", error);

        if (!session && isProtectedRoute(locationRef.current.pathname)) {
          navigateRef.current("/auth");
        }
      } catch (err) {
        console.error("Session init error:", err);
      } finally {
        if (mounted) setIsInitialized(true);
      }
    };

    init();

    // 2. Single auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        console.log("Auth state changed:", event, session?.user?.id);

        switch (event) {
          case "SIGNED_OUT":
            queryClient.clear();
            toast({ title: "Signed out", description: "You have been signed out successfully" });
            if (isProtectedRoute(locationRef.current.pathname)) {
              navigateRef.current("/auth");
            }
            break;

          case "SIGNED_IN":
            queryClient.invalidateQueries();
            if (locationRef.current.pathname === "/auth") {
              navigateRef.current("/");
            }
            break;

          case "TOKEN_REFRESHED":
            queryClient.invalidateQueries();
            break;

          // INITIAL_SESSION — no-op, init() already handled it
          default:
            break;
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient, toast]); // stable deps only

  if (!isInitialized) return null;

  return <>{children}</>;
}

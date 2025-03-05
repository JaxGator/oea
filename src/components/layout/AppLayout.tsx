
import { useEffect, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { DesktopNavigation } from "../DesktopNavigation";
import { MobileNavigation } from "../MobileNavigation";
import { useMaintenanceMode } from "@/hooks/useMaintenanceMode";
import Maintenance from "@/pages/Maintenance";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/home/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

const skipLinkStyles = `
  sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 
  bg-primary text-primary-foreground px-4 py-2 rounded-md 
  z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
`;

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2">Loading content...</span>
  </div>
);

const ErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="p-4 rounded-lg bg-red-50 text-red-800 max-w-md">
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <p>We encountered an error loading this page. Please try refreshing.</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

export function AppLayout() {
  const { isMaintenanceMode } = useMaintenanceMode();
  const location = useLocation();

  // Fetch Google Analytics ID
  const { data: gaId } = useQuery({
    queryKey: ['google-analytics-id'],
    queryFn: async () => {
      try {
        const { data } = await supabase
          .from('site_config')
          .select('value')
          .eq('key', 'google_analytics_id')
          .single();
        return data?.value;
      } catch (error) {
        console.error('Failed to fetch Google Analytics ID:', error);
        return null;
      }
    },
    staleTime: Infinity
  });

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (gaId && typeof window !== 'undefined') {
      try {
        // Load Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) {
          window.dataLayer.push(args);
        }
        gtag('js', new Date());
        gtag('config', gaId);

        console.log('Google Analytics initialized with ID:', gaId);
      } catch (error) {
        console.error('Failed to initialize Google Analytics:', error);
      }
    }
  }, [gaId]);

  if (isMaintenanceMode) {
    return <Maintenance />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Skip Links */}
      <div className="flex gap-4 absolute top-0 left-0">
        <a href="#main-content" className={skipLinkStyles}>
          Skip to main content
        </a>
        <a href="#main-navigation" className={skipLinkStyles}>
          Skip to main navigation
        </a>
        <a href="#footer" className={skipLinkStyles}>
          Skip to footer
        </a>
      </div>

      {/* Main Navigation */}
      <nav id="main-navigation" aria-label="Main navigation">
        <DesktopNavigation />
        <MobileNavigation />
      </nav>

      {/* Main Content */}
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <ErrorBoundary fallback={<ErrorFallback />}>
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer id="footer" tabIndex={-1}>
        <Footer />
      </footer>

      <Toaster />
    </div>
  );
}

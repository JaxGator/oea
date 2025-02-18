
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { DesktopNavigation } from "../DesktopNavigation";
import { MobileNavigation } from "../MobileNavigation";
import { useMaintenanceMode } from "@/hooks/useMaintenanceMode";
import Maintenance from "@/pages/Maintenance";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/home/Footer";
import { useQuery } from "@tanstack/react-query";

const skipLinkStyles = `
  sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 
  bg-primary text-primary-foreground px-4 py-2 rounded-md 
  z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
`;

export function AppLayout() {
  const { isMaintenanceMode } = useMaintenanceMode();

  // Fetch Google Analytics ID
  const { data: gaId } = useQuery({
    queryKey: ['google-analytics-id'],
    queryFn: async () => {
      const { data } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'google_analytics_id')
        .single();
      return data?.value;
    }
  });

  useEffect(() => {
    const initializeGA = async () => {
      if (gaId && typeof window !== 'undefined') {
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
      }
    };

    initializeGA();
  }, [gaId]);

  useEffect(() => {
    const fetchFavicon = async () => {
      const { data } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'favicon_url')
        .single();

      if (data?.value) {
        // Remove any existing favicon
        const existingFavicon = document.querySelector("link[rel*='icon']");
        if (existingFavicon) {
          existingFavicon.remove();
        }

        // Create and append new favicon
        const link = document.createElement('link');
        link.setAttribute('type', 'image/x-icon');
        link.setAttribute('rel', 'shortcut icon');
        link.setAttribute('href', data.value);
        document.head.appendChild(link);
      }
    };

    fetchFavicon();
  }, []);

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
        <Outlet />
      </main>

      {/* Footer */}
      <footer id="footer" tabIndex={-1}>
        <Footer />
      </footer>

      <Toaster />
    </div>
  );
}

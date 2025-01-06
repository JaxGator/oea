import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { DesktopNavigation } from "../DesktopNavigation";
import { MobileNavigation } from "../MobileNavigation";
import { useMaintenanceMode } from "@/hooks/useMaintenanceMode";
import Maintenance from "@/pages/Maintenance";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/home/Footer";

// Add styles for the skip links
const skipLinkStyles = `
  sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 
  bg-primary text-primary-foreground px-4 py-2 rounded-md 
  z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
`;

export function AppLayout() {
  const { isMaintenanceMode } = useMaintenanceMode();

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
      <header>
        <nav id="main-navigation" aria-label="Main navigation">
          <DesktopNavigation />
          <MobileNavigation />
        </nav>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1 container mx-auto px-4" tabIndex={-1}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer id="footer" tabIndex={-1}>
        <Footer />
      </footer>

      <Toaster />
      <CookieConsent />
    </div>
  );
}
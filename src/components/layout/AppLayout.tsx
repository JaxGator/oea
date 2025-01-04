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
      <DesktopNavigation />
      <MobileNavigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      <CookieConsent />
    </div>
  );
}
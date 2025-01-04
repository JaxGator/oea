import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { DesktopNavigation } from "../DesktopNavigation";
import { MobileNavigation } from "../MobileNavigation";
import { useMaintenanceMode } from "@/hooks/useMaintenanceMode";
import { Maintenance } from "@/pages/Maintenance";
import { supabase } from "@/integrations/supabase/client";

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
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = data.value;
        document.getElementsByTagName('head')[0].appendChild(link);
      }
    };

    fetchFavicon();
  }, []);

  if (isMaintenanceMode) {
    return <Maintenance />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DesktopNavigation />
      <MobileNavigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
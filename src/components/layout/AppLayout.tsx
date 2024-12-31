import { useEffect } from "react";
import { DesktopNavigation } from "@/components/DesktopNavigation";
import { MobileNavigation } from "@/components/MobileNavigation";
import { AdminNotifications } from "@/components/admin/notifications/AdminNotifications";
import { useAuthState } from "@/hooks/useAuthState";
import { Footer } from "@/components/home/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { supabase } from "@/integrations/supabase/client";
import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  const { profile } = useAuthState();
  
  useEffect(() => {
    const loadFavicon = async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'favicon_url')
        .single();

      if (data?.value) {
        const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
        if (faviconLink) {
          faviconLink.href = data.value;
        }
      }
    };

    const loadThemeSettings = async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('key, value')
        .in('key', [
          'button_primary_color',
          'button_hover_color',
          'page_background',
          'text_primary_color',
          'accent_color'
        ]);

      if (data) {
        const root = document.documentElement;
        data.forEach(({ key, value }) => {
          switch (key) {
            case 'button_primary_color':
              root.style.setProperty('--button-primary', value);
              break;
            case 'button_hover_color':
              root.style.setProperty('--button-hover', value);
              break;
            case 'page_background':
              root.style.setProperty('--page-background', value);
              break;
            case 'text_primary_color':
              root.style.setProperty('--text-primary', value);
              break;
            case 'accent_color':
              root.style.setProperty('--accent', value);
              break;
          }
        });
      }
    };

    loadFavicon();
    loadThemeSettings();
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ 
      backgroundColor: 'var(--page-background, white)',
      color: 'var(--text-primary, black)'
    }}>
      <div className="relative">
        <DesktopNavigation />
        {profile?.is_admin && (
          <div className="absolute right-4 top-2">
            <AdminNotifications />
          </div>
        )}
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileNavigation />
      <CookieConsent />
    </div>
  );
}
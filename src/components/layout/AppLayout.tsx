import { useEffect } from "react";
import { DesktopNavigation } from "@/components/DesktopNavigation";
import { MobileNavigation } from "@/components/MobileNavigation";
import { AdminNotifications } from "@/components/admin/notifications/AdminNotifications";
import { useAuthState } from "@/hooks/useAuthState";
import { Footer } from "@/components/home/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { supabase } from "@/integrations/supabase/client";

export function AppLayout({ children }: { children: React.ReactNode }) {
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

    loadFavicon();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative">
        <DesktopNavigation />
        {profile?.is_admin && (
          <div className="absolute right-4 top-2">
            <AdminNotifications />
          </div>
        )}
      </div>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileNavigation />
      <CookieConsent />
    </div>
  );
}
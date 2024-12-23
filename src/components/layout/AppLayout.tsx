import { useEffect } from "react";
import { DesktopNavigation } from "@/components/DesktopNavigation";
import { MobileNavigation } from "@/components/MobileNavigation";
import { AdminNotifications } from "@/components/admin/notifications/AdminNotifications";
import { useAuthState } from "@/hooks/useAuthState";
import { Footer } from "@/components/home/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { supabase } from "@/integrations/supabase/client";
import { Outlet } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function AppLayout() {
  const { profile } = useAuthState();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadFavicon = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('value')
          .eq('key', 'favicon_url')
          .maybeSingle();

        if (error) {
          console.error('Error fetching favicon:', error);
          return;
        }

        if (data?.value) {
          const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
          if (faviconLink) {
            faviconLink.href = data.value;
          }
        }
      } catch (error) {
        console.error('Error in loadFavicon:', error);
        toast({
          title: "Warning",
          description: "Failed to load custom favicon",
          variant: "destructive",
        });
      }
    };

    loadFavicon();
  }, [toast]);

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
        <Outlet />
      </main>
      <Footer />
      <MobileNavigation />
      <CookieConsent />
    </div>
  );
}
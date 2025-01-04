import { Outlet } from "react-router-dom";
import { DesktopNavigation } from "@/components/DesktopNavigation";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/CookieConsent";
import { usePageTitle } from "@/hooks/usePageTitle";

export function AppLayout() {
  usePageTitle();

  return (
    <div className="min-h-screen bg-[#F1F0FB]">
      <DesktopNavigation />
      <MobileNavigation />
      <main className="pt-16">
        <Outlet />
      </main>
      <Toaster />
      <CookieConsent />
    </div>
  );
}
import { Outlet } from "react-router-dom";
import { DesktopNavigation } from "@/components/DesktopNavigation";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/CookieConsent";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Footer } from "@/components/home/Footer";

export function AppLayout() {
  usePageTitle();

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F0FB]">
      <DesktopNavigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileNavigation />
      <Toaster />
      <CookieConsent />
    </div>
  );
}
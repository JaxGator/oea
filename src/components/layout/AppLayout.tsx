import { DesktopNavigation } from "@/components/DesktopNavigation";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Footer } from "@/components/home/Footer";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <DesktopNavigation />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileNavigation />
    </div>
  );
}
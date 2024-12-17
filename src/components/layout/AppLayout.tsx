import { DesktopNavigation } from "@/components/DesktopNavigation";
import { MobileNavigation } from "@/components/MobileNavigation";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <DesktopNavigation />
      <main className="flex-1">
        {children}
      </main>
      <MobileNavigation />
    </div>
  );
}
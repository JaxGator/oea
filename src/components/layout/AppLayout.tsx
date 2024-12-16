import { DesktopNavigation } from "@/components/DesktopNavigation";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useAuthState } from "@/hooks/useAuthState";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthState();

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
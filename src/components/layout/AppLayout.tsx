import { DesktopNavigation } from "@/components/DesktopNavigation";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useAuthState } from "@/hooks/useAuthState";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthState();

  return (
    <>
      {user && <DesktopNavigation />}
      {children}
      {user && <MobileNavigation />}
    </>
  );
}
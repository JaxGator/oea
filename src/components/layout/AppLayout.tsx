import { DesktopNavigation } from "@/components/DesktopNavigation";
import { MobileNavigation } from "@/components/MobileNavigation";
import { AdminNotifications } from "@/components/admin/notifications/AdminNotifications";
import { useAuthState } from "@/hooks/useAuthState";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile } = useAuthState();
  
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
      <MobileNavigation />
    </div>
  );
}
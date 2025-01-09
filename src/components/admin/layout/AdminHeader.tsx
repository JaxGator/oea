import { NotificationCenter } from "../notifications/NotificationCenter";
import { AdminNotifications } from "../notifications/AdminNotifications";

export function AdminHeader() {
  return (
    <div className="flex justify-end items-center max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <NotificationCenter />
        <AdminNotifications />
      </div>
    </div>
  );
}
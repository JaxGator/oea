import { NotificationCenter } from "../notifications/NotificationCenter";
import { AdminNotifications } from "../notifications/AdminNotifications";

export function AdminHeader() {
  return (
    <header className="bg-gray-800 p-4">
      <div className="flex justify-end items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <NotificationCenter />
          <AdminNotifications />
        </div>
      </div>
    </header>
  );
}
import { NotificationCenter } from "../notifications/NotificationCenter";
import { AdminNotifications } from "../notifications/AdminNotifications";

export function AdminHeader() {
  return (
    <header className="bg-gray-900 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <NotificationCenter />
          <AdminNotifications />
        </div>
      </div>
    </header>
  );
}
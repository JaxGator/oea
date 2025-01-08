import { NotificationCenter } from "../notifications/NotificationCenter";
import { AdminNotifications } from "../notifications/AdminNotifications";
import { Shield } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="bg-gray-900 p-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex-1 flex justify-center items-center">
          <div className="bg-[#D4AF37] px-6 py-2 rounded-lg flex items-center gap-2">
            <Shield className="h-6 w-6 text-gray-900" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Area</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <NotificationCenter />
          <AdminNotifications />
        </div>
      </div>
    </header>
  );
}
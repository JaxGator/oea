import { ReactNode } from "react";
import { AdminHeader } from "./AdminHeader";
import { Shield } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-gray-900" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Area</h1>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
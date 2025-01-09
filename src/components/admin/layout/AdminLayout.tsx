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
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-6 w-6 text-gray-600" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-gray-600">Admin Area</h1>
        </div>
        {children}
      </main>
    </div>
  );
}
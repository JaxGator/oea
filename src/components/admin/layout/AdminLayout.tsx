
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
      <main className="container mx-auto py-4 sm:py-6 px-3 sm:px-4 max-w-[100vw] overflow-x-hidden">
        <div className="flex flex-col items-center gap-2 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" aria-hidden="true" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Area</h1>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

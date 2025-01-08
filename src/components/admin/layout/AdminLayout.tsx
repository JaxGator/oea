import { ReactNode } from "react";
import { AdminHeader } from "./AdminHeader";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}
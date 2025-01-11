import { AdminTabs } from "@/components/admin/navigation/AdminTabs";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { RequireAdmin } from "@/components/auth/RequireAdmin";

export default function Admin() {
  return (
    <RequireAdmin>
      <AdminLayout>
        <AdminHeader />
        <div className="container mx-auto py-6">
          <AdminTabs />
        </div>
      </AdminLayout>
    </RequireAdmin>
  );
}
import { useSearchParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { AdminTabs } from "@/components/admin/navigation/AdminTabs";
import { RequireAdmin } from "@/components/auth/RequireAdmin";

export default function Admin() {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  return (
    <RequireAdmin>
      <AdminLayout>
        <AdminTabs defaultTab={tabFromUrl || undefined} />
      </AdminLayout>
    </RequireAdmin>
  );
}
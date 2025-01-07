import { useSearchParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { AdminTabs } from "@/components/admin/navigation/AdminTabs";

export default function Admin() {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  // Add error logging
  console.log('Admin page rendering with tab:', tabFromUrl);

  return (
    <AdminLayout>
      <AdminTabs defaultTab={tabFromUrl || undefined} />
    </AdminLayout>
  );
}
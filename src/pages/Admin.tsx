import { useSearchParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { AdminTabs } from "@/components/admin/navigation/AdminTabs";
import { RequireAdmin } from "@/components/auth/RequireAdmin";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

export default function Admin() {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  return (
    <ErrorBoundary 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="p-4 rounded-lg bg-red-50 text-red-800">
            <h2 className="text-lg font-semibold mb-2">Admin Area Error</h2>
            <p>There was a problem loading the admin area. Please try refreshing the page.</p>
          </div>
        </div>
      }
    >
      <RequireAdmin>
        <AdminLayout>
          <AdminTabs defaultTab={tabFromUrl || undefined} />
        </AdminLayout>
      </RequireAdmin>
    </ErrorBoundary>
  );
}
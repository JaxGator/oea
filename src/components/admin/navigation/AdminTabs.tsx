import { Suspense, lazy } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Settings, Image, DollarSign, BarChart3, TestTube2 } from "lucide-react";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load admin components
const AdminUserList = lazy(() => import("@/components/admin/AdminUserList"));
const SiteConfigManager = lazy(() => import("@/components/admin/SiteConfigManager"));
const GalleryManager = lazy(() => import("@/components/admin/GalleryManager"));
const PaymentManager = lazy(() => import("@/components/admin/payments/PaymentManager"));
const ReportsTabs = lazy(() => import("@/components/admin/reports/ReportsLayout"));
const AdminTestRunner = lazy(() => import("@/components/admin/testing/AdminTestRunner"));

// Loading fallback component
const TabLoader = () => (
  <div className="space-y-4 p-8">
    <Skeleton className="h-8 w-[200px]" />
    <Skeleton className="h-[400px] w-full" />
  </div>
);

interface AdminTabsProps {
  defaultTab?: string;
}

export function AdminTabs({ defaultTab = "users" }: AdminTabsProps) {
  return (
    <Tabs defaultValue={defaultTab} className="space-y-4">
      <TabsList className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-0 h-auto">
        <TabsTrigger value="users" className="w-full sm:w-auto justify-start sm:justify-center">
          <Users className="h-4 w-4 mr-2" />
          Users
        </TabsTrigger>
        <TabsTrigger value="gallery" className="w-full sm:w-auto justify-start sm:justify-center">
          <Image className="h-4 w-4 mr-2" />
          Photo Gallery
        </TabsTrigger>
        <TabsTrigger value="payments" className="w-full sm:w-auto justify-start sm:justify-center">
          <DollarSign className="h-4 w-4 mr-2" />
          Payments
        </TabsTrigger>
        <TabsTrigger value="reports" className="w-full sm:w-auto justify-start sm:justify-center">
          <BarChart3 className="h-4 w-4 mr-2" />
          Reports
        </TabsTrigger>
        <TabsTrigger value="testing" className="w-full sm:w-auto justify-start sm:justify-center">
          <TestTube2 className="h-4 w-4 mr-2" />
          Testing
        </TabsTrigger>
        <TabsTrigger value="site-config" className="w-full sm:w-auto justify-start sm:justify-center">
          <Settings className="h-4 w-4 mr-2" />
          Site Configuration
        </TabsTrigger>
      </TabsList>

      <ErrorBoundary fallback={<div>Error loading admin content</div>}>
        <TabsContent value="users" className="space-y-4 min-h-[300px]">
          <Suspense fallback={<TabLoader />}>
            <AdminUserList />
          </Suspense>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4 min-h-[300px]">
          <Suspense fallback={<TabLoader />}>
            <GalleryManager />
          </Suspense>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4 min-h-[300px]">
          <Suspense fallback={<TabLoader />}>
            <PaymentManager />
          </Suspense>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4 min-h-[300px]">
          <Suspense fallback={<TabLoader />}>
            <ReportsTabs />
          </Suspense>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4 min-h-[300px]">
          <Suspense fallback={<TabLoader />}>
            <AdminTestRunner />
          </Suspense>
        </TabsContent>

        <TabsContent value="site-config" className="space-y-4 min-h-[300px]">
          <Suspense fallback={<TabLoader />}>
            <SiteConfigManager />
          </Suspense>
        </TabsContent>
      </ErrorBoundary>
    </Tabs>
  );
}
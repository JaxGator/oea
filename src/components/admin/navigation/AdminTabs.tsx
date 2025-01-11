import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminUserList } from "@/components/admin/AdminUserList";
import { PaymentManager } from "@/components/admin/payments/PaymentManager";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { SiteConfigManager } from "@/components/admin/SiteConfigManager";
import { AdminNotifications } from "@/components/admin/notifications/AdminNotifications";
import { ReportsLayout } from "@/components/admin/reports/ReportsLayout";
import { AdminTestRunner } from "@/components/admin/testing/AdminTestRunner";

export function AdminTabs() {
  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="gallery">Gallery</TabsTrigger>
        <TabsTrigger value="config">Config</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="testing">Testing</TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="users">
          <AdminUserList />
        </TabsContent>
        <TabsContent value="payments">
          <PaymentManager />
        </TabsContent>
        <TabsContent value="gallery">
          <GalleryManager />
        </TabsContent>
        <TabsContent value="config">
          <SiteConfigManager />
        </TabsContent>
        <TabsContent value="notifications">
          <AdminNotifications />
        </TabsContent>
        <TabsContent value="reports">
          <ReportsLayout />
        </TabsContent>
        <TabsContent value="testing">
          <AdminTestRunner />
        </TabsContent>
      </div>
    </Tabs>
  );
}
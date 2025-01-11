import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminUserList } from "@/components/admin/AdminUserList";
import PaymentManager from "@/components/admin/payments/PaymentManager";
import GalleryManager from "@/components/admin/GalleryManager";
import SiteConfigManager from "@/components/admin/SiteConfigManager";
import { AdminNotifications } from "@/components/admin/notifications/AdminNotifications";
import ReportsLayout from "@/components/admin/reports/ReportsLayout";
import AdminTestRunner from "@/components/admin/testing/AdminTestRunner";

export function AdminTabs() {
  return (
    <Tabs defaultValue="users" className="w-full">
      <div className="overflow-x-auto pb-2">
        <TabsList className="w-full flex-nowrap min-w-max">
          <TabsTrigger value="users" className="whitespace-nowrap">Users</TabsTrigger>
          <TabsTrigger value="payments" className="whitespace-nowrap">Payments</TabsTrigger>
          <TabsTrigger value="gallery" className="whitespace-nowrap">Gallery</TabsTrigger>
          <TabsTrigger value="config" className="whitespace-nowrap">Config</TabsTrigger>
          <TabsTrigger value="notifications" className="whitespace-nowrap">Notifications</TabsTrigger>
          <TabsTrigger value="reports" className="whitespace-nowrap">Reports</TabsTrigger>
          <TabsTrigger value="testing" className="whitespace-nowrap">Testing</TabsTrigger>
        </TabsList>
      </div>

      <div className="mt-6 px-2 md:px-0">
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
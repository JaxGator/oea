import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Settings, Image, DollarSign, BarChart3, TestTube2 } from "lucide-react";
import { AdminUserList } from "@/components/admin/AdminUserList";
import SiteConfigManager from "@/components/admin/SiteConfigManager";
import GalleryManager from "@/components/admin/GalleryManager";
import PaymentManager from "@/components/admin/payments/PaymentManager";
import ReportsTabs from "@/components/admin/reports/ReportsLayout";
import { UserActivityReport } from "@/components/admin/reports/UserActivityReport";
import { EventParticipationReport } from "@/components/admin/reports/EventParticipationReport";
import { SystemUsageReport } from "@/components/admin/reports/SystemUsageReport";
import AdminTestRunner from "@/components/admin/testing/AdminTestRunner";
import { AdminErrorBoundary } from "../error/AdminErrorBoundary";

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

      <AdminErrorBoundary>
        <TabsContent value="users" className="space-y-4 min-h-[300px]">
          <AdminUserList />
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4 min-h-[300px]">
          <GalleryManager />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4 min-h-[300px]">
          <PaymentManager />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4 min-h-[300px]">
          <Tabs defaultValue="user-activity" className="space-y-4">
            <ReportsTabs />
            
            <TabsContent value="user-activity">
              <UserActivityReport />
            </TabsContent>
            
            <TabsContent value="event-participation">
              <EventParticipationReport />
            </TabsContent>
            
            <TabsContent value="system-usage">
              <SystemUsageReport />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4 min-h-[300px]">
          <AdminTestRunner />
        </TabsContent>

        <TabsContent value="site-config" className="space-y-4 min-h-[300px]">
          <SiteConfigManager />
        </TabsContent>
      </AdminErrorBoundary>
    </Tabs>
  );
}
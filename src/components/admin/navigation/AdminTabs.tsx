import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminUserList } from "@/components/admin/AdminUserList";
import PaymentManager from "@/components/admin/payments/PaymentManager";
import GalleryManager from "@/components/admin/GalleryManager";
import SiteConfigManager from "@/components/admin/SiteConfigManager";
import { AdminNotifications } from "@/components/admin/notifications/AdminNotifications";
import ReportsLayout from "@/components/admin/reports/ReportsLayout";
import AdminTestRunner from "@/components/admin/testing/AdminTestRunner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function AdminTabs() {
  // Fetch counts for badges
  const { data: userCount, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin-unapproved-users-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false);
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: notificationCount, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ['admin-unread-notifications-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('waitlist_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      
      if (error) throw error;
      return count || 0;
    },
  });

  const renderTabTrigger = (value: string, label: string, count?: number, isLoading?: boolean) => (
    <TabsTrigger 
      value={value} 
      className="relative whitespace-nowrap group"
    >
      <span className="flex items-center gap-2">
        {label}
        {isLoading ? (
          <Skeleton className="h-5 w-5 rounded-full" />
        ) : count ? (
          <Badge 
            variant="secondary" 
            className="transition-all group-hover:bg-primary/20"
          >
            {count}
          </Badge>
        ) : null}
      </span>
    </TabsTrigger>
  );

  return (
    <Tabs defaultValue="users" className="w-full">
      <div className="overflow-x-auto pb-2">
        <TabsList className="w-full flex-nowrap min-w-max bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {renderTabTrigger("users", "Users", userCount, isLoadingUsers)}
          {renderTabTrigger("payments", "Payments")}
          {renderTabTrigger("gallery", "Gallery")}
          {renderTabTrigger("config", "Config")}
          {renderTabTrigger("notifications", "Notifications", notificationCount, isLoadingNotifications)}
          {renderTabTrigger("reports", "Reports")}
          {renderTabTrigger("testing", "Testing")}
        </TabsList>
      </div>

      <div className="mt-6 px-2 md:px-0">
        <TabsContent value="users" className="animate-fade-in">
          <AdminUserList />
        </TabsContent>
        <TabsContent value="payments" className="animate-fade-in">
          <PaymentManager />
        </TabsContent>
        <TabsContent value="gallery" className="animate-fade-in">
          <GalleryManager />
        </TabsContent>
        <TabsContent value="config" className="animate-fade-in">
          <SiteConfigManager />
        </TabsContent>
        <TabsContent value="notifications" className="animate-fade-in">
          <AdminNotifications />
        </TabsContent>
        <TabsContent value="reports" className="animate-fade-in">
          <ReportsLayout />
        </TabsContent>
        <TabsContent value="testing" className="animate-fade-in">
          <AdminTestRunner />
        </TabsContent>
      </div>
    </Tabs>
  );
}
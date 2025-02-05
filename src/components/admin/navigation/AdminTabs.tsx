
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminUserList } from "@/components/admin/AdminUserList";
import PaymentManager from "@/components/admin/payments/PaymentManager";
import GalleryManager from "@/components/admin/GalleryManager";
import SiteConfigManager from "@/components/admin/SiteConfigManager";
import { AdminNotifications } from "@/components/admin/notifications/AdminNotifications";
import { ReportsLayout } from "@/components/admin/reports/ReportsLayout";
import AdminTestRunner from "@/components/admin/testing/AdminTestRunner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

import { cn } from "@/lib/utils";

export function AdminTabs() {
  const isMobile = useIsMobile();

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
      className={cn(
        "relative whitespace-nowrap group px-2 sm:px-4",
        "data-[state=active]:text-primary-foreground"
      )}
    >
      <span className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
        {isMobile ? label.slice(0, 3) : label}
        {isLoading ? (
          <Skeleton className="h-4 w-4 rounded-full" />
        ) : count ? (
          <Badge 
            variant="secondary" 
            className={cn(
              "transition-all group-hover:bg-primary/20",
              "h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 flex items-center justify-center"
            )}
          >
            {count}
          </Badge>
        ) : null}
      </span>
    </TabsTrigger>
  );

  return (
    <Tabs defaultValue="users" className="w-full">
      <div className="overflow-x-auto scrollbar-hide pb-2">
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

      <div className="mt-4 sm:mt-6">
        <TabsContent value="users" className="animate-fade-in m-0">
          <AdminUserList />
        </TabsContent>
        <TabsContent value="payments" className="animate-fade-in m-0">
          <PaymentManager />
        </TabsContent>
        <TabsContent value="gallery" className="animate-fade-in m-0">
          <GalleryManager />
        </TabsContent>
        <TabsContent value="config" className="animate-fade-in m-0">
          <SiteConfigManager />
        </TabsContent>
        <TabsContent value="notifications" className="animate-fade-in m-0">
          <AdminNotifications />
        </TabsContent>
        <TabsContent value="reports" className="animate-fade-in m-0">
          <ReportsLayout />
        </TabsContent>
        <TabsContent value="testing" className="animate-fade-in m-0">
          <AdminTestRunner />
        </TabsContent>
      </div>
    </Tabs>
  );
}

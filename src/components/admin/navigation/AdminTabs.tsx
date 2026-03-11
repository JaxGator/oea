
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminUserList } from "@/components/admin/AdminUserList";
import PaymentManager from "@/components/admin/payments/PaymentManager";
import GalleryManager from "@/components/admin/GalleryManager";
import SiteConfigManager from "@/components/admin/SiteConfigManager";
import { AdminNotifications } from "@/components/admin/notifications/AdminNotifications";
import { ReportsLayout } from "@/components/admin/reports/ReportsLayout";
import AdminTestRunner from "@/components/admin/testing/AdminTestRunner";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function AdminTabs() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("users");

  // Pre-fetch data for other tabs to improve tab switching performance
  useEffect(() => {
    if (activeTab === "users") {
      // Prefetch payments count
      supabase.from('payments').select('*', { count: 'exact', head: true })
        .then(() => {})
        .catch(() => console.log('Failed to prefetch payments count'));
      // Prefetch gallery count
      supabase.from('gallery_images').select('*', { count: 'exact', head: true })
        .then(() => {})
        .catch(() => console.log('Failed to prefetch gallery count'));
    }
  }, [activeTab]);

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
        .from('admin_notifications')
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
        "relative whitespace-nowrap group",
        "px-2.5 py-1.5 sm:px-4 sm:py-2",
        "transition-all duration-200",
        "data-[state=active]:bg-primary",
        "data-[state=active]:text-white",
        "hover:bg-primary/10",
        "focus-visible:outline-2",
        "focus-visible:outline-primary",
        "focus-visible:outline-offset-2",
        "focus-visible:ring-0"
      )}
      onClick={() => setActiveTab(value)}
    >
      <span className="flex items-center gap-1 sm:gap-2">
        {isMobile ? label.slice(0, 3) : label}
        {isLoading ? (
          <Skeleton className="h-4 w-4 rounded-full" />
        ) : count ? (
          <Badge 
            variant="secondary" 
            className={cn(
              "transition-all group-hover:bg-primary/20",
              "h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0",
              "flex items-center justify-center text-xs sm:text-sm",
              "group-data-[state=active]:bg-white",
              "group-data-[state=active]:text-primary"
            )}
          >
            {count}
          </Badge>
        ) : null}
      </span>
    </TabsTrigger>
  );

  return (
    <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="relative overflow-x-auto scrollbar-hide">
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-100 to-transparent pointer-events-none sm:hidden" />
        <TabsList className="w-full flex-nowrap min-w-max bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-1">
          {renderTabTrigger("users", "Users", userCount, isLoadingUsers)}
          {renderTabTrigger("payments", "Payments")}
          {renderTabTrigger("gallery", "Gallery")}
          {renderTabTrigger("config", "Config")}
          {renderTabTrigger("notifications", "Notifications", notificationCount, isLoadingNotifications)}
          {renderTabTrigger("reports", "Reports")}
          {renderTabTrigger("testing", "Testing")}
        </TabsList>
      </div>

      <div className="mt-3 sm:mt-6">
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

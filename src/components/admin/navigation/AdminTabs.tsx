import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Settings, Image } from "lucide-react";
import { AdminUserList } from "@/components/admin/AdminUserList";
import { SiteConfigManager } from "@/components/admin/SiteConfigManager";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

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
        <TabsTrigger value="site-config" className="w-full sm:w-auto justify-start sm:justify-center">
          <Settings className="h-4 w-4 mr-2" />
          Site Configuration
        </TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-4 min-h-[300px]">
        <ErrorBoundary fallback={<div>Error loading user management</div>}>
          <AdminUserList />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="gallery" className="space-y-4 min-h-[300px]">
        <ErrorBoundary fallback={<div>Error loading gallery manager</div>}>
          <GalleryManager />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="site-config" className="space-y-4 min-h-[300px]">
        <ErrorBoundary fallback={<div>Error loading site configuration</div>}>
          <SiteConfigManager />
        </ErrorBoundary>
      </TabsContent>
    </Tabs>
  );
}
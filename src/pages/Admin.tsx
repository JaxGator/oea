import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminUserList } from "@/components/admin/AdminUserList";
import { SiteConfigManager } from "@/components/admin/SiteConfigManager";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Settings, Image } from "lucide-react";

export default function Admin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-[#222222] py-4 sm:py-12 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Admin Dashboard</h1>
            
            <Tabs defaultValue="users" className="space-y-4">
              <TabsList>
                <TabsTrigger value="users">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="site-config">
                  <Settings className="h-4 w-4 mr-2" />
                  Site Configuration
                </TabsTrigger>
                <TabsTrigger value="gallery">
                  <Image className="h-4 w-4 mr-2" />
                  Photo Gallery
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <AdminUserList />
              </TabsContent>

              <TabsContent value="site-config">
                <SiteConfigManager />
              </TabsContent>

              <TabsContent value="gallery">
                <GalleryManager />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
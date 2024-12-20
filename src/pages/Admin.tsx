import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminUserList } from "@/components/admin/AdminUserList";
import { SiteConfigManager } from "@/components/admin/SiteConfigManager";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Settings, Image } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function Admin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  return (
    <div className="min-h-screen bg-[#222222] py-4 sm:py-12 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Admin Dashboard</h1>
            
            <Tabs defaultValue={tabFromUrl || "gallery"} className="space-y-4">
              <TabsList className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-0 h-auto">
                <TabsTrigger value="gallery" className="w-full sm:w-auto justify-start sm:justify-center">
                  <Image className="h-4 w-4 mr-2" />
                  Photo Gallery
                </TabsTrigger>
                <TabsTrigger value="users" className="w-full sm:w-auto justify-start sm:justify-center">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="site-config" className="w-full sm:w-auto justify-start sm:justify-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Site Configuration
                </TabsTrigger>
              </TabsList>

              <TabsContent value="gallery">
                <GalleryManager />
              </TabsContent>

              <TabsContent value="users">
                <AdminUserList />
              </TabsContent>

              <TabsContent value="site-config">
                <SiteConfigManager />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
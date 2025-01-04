import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AdminUserList } from "@/components/admin/AdminUserList";
import { SiteConfigManager } from "@/components/admin/SiteConfigManager";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Settings, Image } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

export default function Admin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  // Add error logging
  console.log('Admin page rendering with tab:', tabFromUrl);

  const handleError = (error: Error) => {
    console.error('Admin page error:', error);
    toast({
      title: "Error",
      description: "An error occurred while loading the admin page. Please try again.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-[#222222] py-4 sm:py-12 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Admin Dashboard</h1>
            
            <ErrorBoundary
              fallback={
                <div className="p-4 text-center">
                  <p className="text-red-500">Something went wrong loading this section.</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    Retry
                  </button>
                </div>
              }
            >
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
                  <ErrorBoundary fallback={<div>Error loading gallery manager</div>}>
                    <GalleryManager />
                  </ErrorBoundary>
                </TabsContent>

                <TabsContent value="users">
                  <ErrorBoundary fallback={<div>Error loading user list</div>}>
                    <AdminUserList />
                  </ErrorBoundary>
                </TabsContent>

                <TabsContent value="site-config">
                  <ErrorBoundary fallback={<div>Error loading site configuration</div>}>
                    <SiteConfigManager />
                  </ErrorBoundary>
                </TabsContent>
              </Tabs>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}
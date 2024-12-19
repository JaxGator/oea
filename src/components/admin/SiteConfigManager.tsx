import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Settings, Check, X } from "lucide-react";

export function SiteConfigManager() {
  const [configs, setConfigs] = useState({
    google_analytics_id: "",
    google_ads_id: "",
    sitemap_config: "[]"
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('key, value');
      
      if (error) throw error;

      const configObj = data.reduce((acc: any, curr) => {
        acc[curr.key] = curr.value || "";
        return acc;
      }, {});

      setConfigs(configObj);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching configs:', error);
      toast({
        title: "Error",
        description: "Failed to load site configuration",
        variant: "destructive",
      });
    }
  };

  const updateConfig = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('site_config')
        .update({ value })
        .eq('key', key);

      if (error) throw error;

      setConfigs(prev => ({ ...prev, [key]: value }));
      toast({
        title: "Success",
        description: "Configuration updated successfully",
      });
    } catch (error) {
      console.error('Error updating config:', error);
      toast({
        title: "Error",
        description: "Failed to update configuration",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Site Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Google Analytics ID</label>
            <div className="flex gap-2">
              <Input
                value={configs.google_analytics_id}
                onChange={(e) => setConfigs(prev => ({ ...prev, google_analytics_id: e.target.value }))}
                placeholder="Enter Google Analytics ID"
              />
              <Button
                onClick={() => updateConfig('google_analytics_id', configs.google_analytics_id)}
                className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Google Ads ID</label>
            <div className="flex gap-2">
              <Input
                value={configs.google_ads_id}
                onChange={(e) => setConfigs(prev => ({ ...prev, google_ads_id: e.target.value }))}
                placeholder="Enter Google Ads ID"
              />
              <Button
                onClick={() => updateConfig('google_ads_id', configs.google_ads_id)}
                className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sitemap Configuration</label>
            <div className="flex gap-2">
              <Textarea
                value={configs.sitemap_config}
                onChange={(e) => setConfigs(prev => ({ ...prev, sitemap_config: e.target.value }))}
                placeholder="Enter sitemap configuration in JSON format"
                className="min-h-[200px]"
              />
              <Button
                onClick={() => updateConfig('sitemap_config', configs.sitemap_config)}
                className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
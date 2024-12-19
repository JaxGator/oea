import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Globe, Scale, Wrench, Check } from "lucide-react";

export function SiteConfigManager() {
  const [configs, setConfigs] = useState({
    google_analytics_id: "",
    google_ads_id: "",
    sitemap_config: "[]",
    site_name: "",
    site_description: "",
    contact_email: "",
    social_links: "{}",
    maintenance_mode: "false",
    terms_and_conditions_url: "",
    privacy_policy_url: "",
    default_meta_image: "",
    favicon_url: "",
    custom_css: "",
    custom_scripts: ""
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
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Settings className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="legal">
            <Scale className="h-4 w-4 mr-2" />
            Legal
          </TabsTrigger>
          <TabsTrigger value="technical">
            <Wrench className="h-4 w-4 mr-2" />
            Technical
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Site Name</label>
                <div className="flex gap-2">
                  <Input
                    value={configs.site_name}
                    onChange={(e) => setConfigs(prev => ({ ...prev, site_name: e.target.value }))}
                    placeholder="Enter site name"
                  />
                  <Button
                    onClick={() => updateConfig('site_name', configs.site_name)}
                    className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Site Description</label>
                <div className="flex gap-2">
                  <Textarea
                    value={configs.site_description}
                    onChange={(e) => setConfigs(prev => ({ ...prev, site_description: e.target.value }))}
                    placeholder="Enter site description"
                  />
                  <Button
                    onClick={() => updateConfig('site_description', configs.site_description)}
                    className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Email</label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={configs.contact_email}
                    onChange={(e) => setConfigs(prev => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="Enter contact email"
                  />
                  <Button
                    onClick={() => updateConfig('contact_email', configs.contact_email)}
                    className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Social Links</label>
                <div className="space-y-4">
                  {Object.entries(JSON.parse(configs.social_links || '{}')).map(([platform, url]) => (
                    <div key={platform} className="flex gap-2">
                      <Input
                        value={url as string}
                        onChange={(e) => {
                          const socialLinks = JSON.parse(configs.social_links);
                          socialLinks[platform] = e.target.value;
                          setConfigs(prev => ({ ...prev, social_links: JSON.stringify(socialLinks) }));
                        }}
                        placeholder={`Enter ${platform} URL`}
                      />
                    </div>
                  ))}
                  <Button
                    onClick={() => updateConfig('social_links', configs.social_links)}
                    className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save All Social Links
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal">
          <Card>
            <CardHeader>
              <CardTitle>Legal Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Terms and Conditions URL</label>
                <div className="flex gap-2">
                  <Input
                    value={configs.terms_and_conditions_url}
                    onChange={(e) => setConfigs(prev => ({ ...prev, terms_and_conditions_url: e.target.value }))}
                    placeholder="Enter Terms and Conditions URL"
                  />
                  <Button
                    onClick={() => updateConfig('terms_and_conditions_url', configs.terms_and_conditions_url)}
                    className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Privacy Policy URL</label>
                <div className="flex gap-2">
                  <Input
                    value={configs.privacy_policy_url}
                    onChange={(e) => setConfigs(prev => ({ ...prev, privacy_policy_url: e.target.value }))}
                    placeholder="Enter Privacy Policy URL"
                  />
                  <Button
                    onClick={() => updateConfig('privacy_policy_url', configs.privacy_policy_url)}
                    className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Maintenance Mode</label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={configs.maintenance_mode === "true"}
                    onCheckedChange={(checked) => {
                      setConfigs(prev => ({ ...prev, maintenance_mode: checked.toString() }));
                      updateConfig('maintenance_mode', checked.toString());
                    }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {configs.maintenance_mode === "true" ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Default Meta Image URL</label>
                <div className="flex gap-2">
                  <Input
                    value={configs.default_meta_image}
                    onChange={(e) => setConfigs(prev => ({ ...prev, default_meta_image: e.target.value }))}
                    placeholder="Enter default meta image URL"
                  />
                  <Button
                    onClick={() => updateConfig('default_meta_image', configs.default_meta_image)}
                    className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Favicon URL</label>
                <div className="flex gap-2">
                  <Input
                    value={configs.favicon_url}
                    onChange={(e) => setConfigs(prev => ({ ...prev, favicon_url: e.target.value }))}
                    placeholder="Enter favicon URL"
                  />
                  <Button
                    onClick={() => updateConfig('favicon_url', configs.favicon_url)}
                    className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Custom CSS</label>
                <div className="flex gap-2">
                  <Textarea
                    value={configs.custom_css}
                    onChange={(e) => setConfigs(prev => ({ ...prev, custom_css: e.target.value }))}
                    placeholder="Enter custom CSS"
                    className="font-mono"
                  />
                  <Button
                    onClick={() => updateConfig('custom_css', configs.custom_css)}
                    className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Custom Scripts</label>
                <div className="flex gap-2">
                  <Textarea
                    value={configs.custom_scripts}
                    onChange={(e) => setConfigs(prev => ({ ...prev, custom_scripts: e.target.value }))}
                    placeholder="Enter custom scripts"
                    className="font-mono"
                  />
                  <Button
                    onClick={() => updateConfig('custom_scripts', configs.custom_scripts)}
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
                    className="font-mono min-h-[200px]"
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
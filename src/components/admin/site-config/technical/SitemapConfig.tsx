import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type SitemapConfigProps = {
  value: string;
  onChange: (value: string) => void;
  onSave: () => Promise<void>;
  isLoading?: boolean;
};

export function SitemapConfig({ value, onChange, onSave, isLoading }: SitemapConfigProps) {
  const { toast } = useToast();
  const [isValidJson, setIsValidJson] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [sitemapPreview, setSitemapPreview] = React.useState<string>('');

  const handleChange = (newValue: string) => {
    try {
      if (newValue) {
        JSON.parse(newValue);
      }
      setIsValidJson(true);
      onChange(newValue);
      setSitemapPreview(''); // Clear preview when config changes
    } catch (e) {
      setIsValidJson(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave();
      toast({
        title: "Success",
        description: "Sitemap configuration saved successfully",
      });
    } catch (error) {
      console.error('Error saving sitemap config:', error);
      toast({
        title: "Error",
        description: "Failed to save sitemap configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const generateSitemap = async () => {
    try {
      const routes = JSON.parse(value || '[]');
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route: string) => `
  <url>
    <loc>${window.location.origin}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('')}
</urlset>`;

      setSitemapPreview(xml);

      const blob = new Blob([xml], { type: 'text/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Sitemap generated successfully",
      });
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast({
        title: "Error",
        description: "Failed to generate sitemap. Please check your configuration.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-[200px] w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Sitemap Configuration</label>
        <Textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder='Enter routes as JSON array, e.g. ["/", "/about", "/events"]'
          className={`font-mono min-h-[200px] ${!isValidJson ? 'border-red-500' : ''}`}
        />
        {!isValidJson && (
          <p className="text-sm text-red-500">Please enter valid JSON</p>
        )}
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
            disabled={!isValidJson || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
          <Button
            onClick={generateSitemap}
            variant="outline"
            disabled={!isValidJson || isSaving}
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Sitemap
          </Button>
        </div>
      </div>

      {sitemapPreview && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Generated Sitemap Preview</label>
          <div className="bg-gray-50 p-4 rounded-md">
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
              {sitemapPreview}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
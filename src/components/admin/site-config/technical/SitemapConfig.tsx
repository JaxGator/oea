import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SitemapConfigProps = {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
};

export function SitemapConfig({ value, onChange, onSave }: SitemapConfigProps) {
  const { toast } = useToast();
  const [isValidJson, setIsValidJson] = React.useState(true);

  const handleChange = (newValue: string) => {
    try {
      if (newValue) {
        JSON.parse(newValue);
      }
      setIsValidJson(true);
      onChange(newValue);
    } catch (e) {
      setIsValidJson(false);
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
      toast({
        title: "Error",
        description: "Failed to generate sitemap. Please check your configuration.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Sitemap Configuration</label>
      <div className="space-y-2">
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
            onClick={onSave}
            className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
          >
            Save Configuration
          </Button>
          <Button
            onClick={generateSitemap}
            variant="outline"
            disabled={!isValidJson}
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Sitemap
          </Button>
        </div>
      </div>
    </div>
  );
}
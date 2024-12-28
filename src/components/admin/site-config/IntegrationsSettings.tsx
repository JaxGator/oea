import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type IntegrationsSettingsProps = {
  configs: Record<string, string>;
  setConfigs: (configs: Record<string, string>) => void;
  updateConfig: (key: string, value: string) => Promise<void>;
};

export function IntegrationsSettings({ configs, setConfigs, updateConfig }: IntegrationsSettingsProps) {
  const isVerified = configs.verification_status === 'true';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Google Analytics ID</label>
          <div className="flex gap-2">
            <Input
              value={configs.google_analytics_id || ''}
              onChange={(e) => setConfigs({ ...configs, google_analytics_id: e.target.value })}
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
              value={configs.google_ads_id || ''}
              onChange={(e) => setConfigs({ ...configs, google_ads_id: e.target.value })}
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
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Google AdSense Verification</label>
            {isVerified && (
              <span className="text-sm text-green-600 flex items-center">
                <Check className="h-4 w-4 mr-1" />
                Verified
              </span>
            )}
          </div>
          {!isVerified && (
            <Alert variant="warning" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your site is not yet verified with AdSense. Please paste the verification code exactly as provided by Google.
              </AlertDescription>
            </Alert>
          )}
          <div className="flex gap-2">
            <Textarea
              value={configs.google_adsense_snippet || ''}
              onChange={(e) => setConfigs({ ...configs, google_adsense_snippet: e.target.value })}
              placeholder="Paste your Google AdSense verification snippet here"
              className="font-mono text-sm"
              rows={4}
            />
            <Button
              onClick={() => updateConfig('google_adsense_snippet', configs.google_adsense_snippet)}
              className="bg-[#0d97d1] hover:bg-[#0d97d1]/90 h-fit"
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Paste the complete AdSense code snippet provided by Google for site verification.
            The code will be automatically added to your site's header.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
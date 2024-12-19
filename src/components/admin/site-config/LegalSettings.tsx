import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

type LegalSettingsProps = {
  configs: Record<string, string>;
  setConfigs: (configs: Record<string, string>) => void;
  updateConfig: (key: string, value: string) => Promise<void>;
};

export function LegalSettings({ configs, setConfigs, updateConfig }: LegalSettingsProps) {
  return (
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
              onChange={(e) => setConfigs({ ...configs, terms_and_conditions_url: e.target.value })}
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
              onChange={(e) => setConfigs({ ...configs, privacy_policy_url: e.target.value })}
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
  );
}
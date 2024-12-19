import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
          <label className="text-sm font-medium">Terms and Conditions</label>
          <div className="space-y-4">
            <ReactQuill
              value={configs.terms_and_conditions_content || ''}
              onChange={(content) => setConfigs({ ...configs, terms_and_conditions_content: content })}
              className="bg-white"
              theme="snow"
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['link'],
                  ['clean']
                ]
              }}
            />
            <Button
              onClick={() => updateConfig('terms_and_conditions_content', configs.terms_and_conditions_content)}
              className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
            >
              <Check className="h-4 w-4 mr-1" />
              Save Terms and Conditions
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Privacy Policy URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={configs.privacy_policy_url || ''}
              onChange={(e) => setConfigs({ ...configs, privacy_policy_url: e.target.value })}
              placeholder="Enter Privacy Policy URL"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
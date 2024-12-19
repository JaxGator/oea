import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";

type CodeEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  minHeight?: string;
};

export function CodeEditor({ label, value, onChange, onSave, minHeight = "auto" }: CodeEditorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="font-mono"
          style={{ minHeight }}
        />
        <Button
          onClick={onSave}
          className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
        >
          <Check className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>
    </div>
  );
}